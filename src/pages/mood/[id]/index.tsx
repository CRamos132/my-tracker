import dayjs from "dayjs";
import Calendar from "../../../components/Calendar";
import PageWrapper from "../../../components/PageWrapper";
import { useAuth } from "../../../contexts/AuthContext";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Date } from "../../../hooks/useDates";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Mood } from "../../../contexts/MoodsContext";

export default function DailyMoodPage() {
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const getDates = async () => {
    if (!user?.uid) {
      return []
    }
    const startOfMonth = dayjs().startOf('month').unix()
    const endOfMonth = dayjs().endOf('month').unix()
    const q = query(collection(db, "dates"), where("createdBy", "==", user?.uid), where("date", ">=", startOfMonth), where("date", "<=", endOfMonth))
    const querySnapshot = await getDocs(q);
    const dates: Date[] = []
    querySnapshot.forEach((doc) => {
      const dateData = { id: doc.id, ...doc.data() } as Date
      dates.push(dateData)
    });
    return dates
  }

  const datesQuery = useQuery({ queryKey: ['monthDates'], queryFn: getDates })

  const filledDates = useMemo(() => {
    const currentMoodId = router.query.id
    if (!currentMoodId) {
      return []
    }
    const datesData = datesQuery.data ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datesWithMood = datesData.reduce((prev: any, curr) => {
      const moodsChecked = curr?.moodsChecked ?? []
      if (moodsChecked.includes(currentMoodId as string)) {
        return [...prev, curr?.date]
      }
      return [...prev]
    }, [])
    return datesWithMood
  }, [datesQuery.data, router.query.id])

  const getMoodById = async () => {
    const moodId = router.query.id ?? ''
    if (!moodId) {
      return
    }
    const eventDocRef = doc(db, "moods", moodId as string);
    const eventDocSnap = await getDoc(eventDocRef);
    return { id: eventDocSnap.data() && eventDocSnap.id, ...eventDocSnap.data() } as Mood;
  }

  const getMoodQuery = useQuery({
    queryKey: [`mood${router.query.id}`],
    queryFn: getMoodById,
    enabled: Boolean(router.query.id)
  })

  const moodData = getMoodQuery.data

  const goBack = () => {
    router.back()
  }

  useEffect(() => {
    if (user?.uid) {
      queryClient.invalidateQueries({ queryKey: ['monthDates'] })
    }
  }, [queryClient, user?.uid])

  return (
    <PageWrapper>
      <Flex
        margin={'16px 16px 0px 16px'}
        padding={'16px'}
        borderRadius={'4px'}
        bg='gray.100'
        border={'1px solid var(--chakra-colors-gray-500)'}
        alignItems={'center'}
        gap={'8px'}
      >
        <IconButton
          aria-label="Back
        button"
          icon={<RiArrowLeftSLine />}
          borderRadius={'99px'}
          colorScheme='blue'
          variant='outline'
          onClick={goBack}
        />
        <Text
          as='h1'
          fontWeight={'700'}
          fontSize={'24px'}
        >
          {moodData?.name}
        </Text>
      </Flex>
      <Calendar filledDates={filledDates} />
    </PageWrapper>
  )
}