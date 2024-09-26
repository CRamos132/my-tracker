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
import { Task } from "../../../contexts/TasksContext";
import { RiArrowLeftSLine } from "react-icons/ri";

export default function DailyTaskPage() {
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
    const tasks: Date[] = []
    querySnapshot.forEach((doc) => {
      const tasksData = { id: doc.id, ...doc.data() } as Date
      tasks.push(tasksData)
    });
    return tasks
  }

  const datesQuery = useQuery({ queryKey: ['monthDates'], queryFn: getDates })

  const filledDates = useMemo(() => {
    const currentTaskId = router.query.id
    if (!currentTaskId) {
      return []
    }
    const datesData = datesQuery.data ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const datesWithTask = datesData.reduce((prev: any, curr) => {
      if (curr?.tasksDone.includes(currentTaskId as string)) {
        return [...prev, curr?.date]
      }
      return [...prev]
    }, [])
    return datesWithTask
  }, [datesQuery.data, router.query.id])

  const getTaskById = async () => {
    const taskId = router.query.id ?? ''
    if (!taskId) {
      return
    }
    const eventDocRef = doc(db, "tasks", taskId as string);
    const eventDocSnap = await getDoc(eventDocRef);
    return { id: eventDocSnap.data() && eventDocSnap.id, ...eventDocSnap.data() } as Task;
  }

  const getTaskQuery = useQuery({
    queryKey: [`task${router.query.id}`],
    queryFn: getTaskById,
    enabled: Boolean(router.query.id)
  })

  const taskData = getTaskQuery.data

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
          {taskData?.name}
        </Text>
      </Flex>
      <Calendar filledDates={filledDates} />
    </PageWrapper>
  )
}