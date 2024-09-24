import dayjs from "dayjs"
import { useAuth } from "../../contexts/AuthContext"
import { collection, getDocs, query, where } from "firebase/firestore/lite"
import { db } from "../../lib/firebase"
import { useQuery } from "@tanstack/react-query"

export interface Date {
  id: string
  createdBy: string
  date: number
  tasksDone: string[]
}

export default function useDates() {
  const { user } = useAuth()

  const getDatesInMonth = async () => {
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

  const datesInMonth = useQuery({ queryKey: ['datesInMonth'], queryFn: getDatesInMonth })

  const getDates = async () => {
    if (!user?.uid) {
      return []
    }
    const startOfDay = dayjs().startOf('day').unix()
    const q = query(collection(db, "dates"), where("createdBy", "==", user?.uid), where("date", "==", startOfDay))
    const querySnapshot = await getDocs(q);
    const tasks: Date[] = []
    querySnapshot.forEach((doc) => {
      const tasksData = { id: doc.id, ...doc.data() } as Date
      tasks.push(tasksData)
    });
    return tasks
  }

  const datesQuery = useQuery({ queryKey: ['dates'], queryFn: getDates })

  return {
    datesQuery: datesQuery.data,
    datesInMonth: datesInMonth.data ?? []
  }
}