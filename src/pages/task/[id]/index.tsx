import dayjs from "dayjs";
import Calendar from "../../../components/Calendar";
import PageWrapper from "../../../components/PageWrapper";
import { useAuth } from "../../../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Date } from "../../../hooks/useDates";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

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

  useEffect(() => {
    if (user?.uid) {
      queryClient.invalidateQueries({ queryKey: ['monthDates'] })
    }
  }, [queryClient, user?.uid])

  return (
    <PageWrapper>
      <Calendar filledDates={filledDates} />
    </PageWrapper>
  )
}