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

  // const getDatesAfter = async (date?: number) => {
  //   if (!user?.uid) {
  //     return []
  //   }
  //   const startOfDay = dayjs().startOf('day').unix()
  //   const q = query(collection(db, "dates"), where("createdBy", "==", user?.uid), where("date", ">=", date ?? startOfDay))
  //   const querySnapshot = await getDocs(q);
  //   const tasks: Date[] = []
  //   querySnapshot.forEach((doc) => {
  //     const tasksData = { id: doc.id, ...doc.data() } as Date
  //     tasks.push(tasksData)
  //   });
  //   return tasks
  // }

  // const datesAfterQuery = useQuery({ queryKey: ['datesAfter'], queryFn: getDatesAfter })

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
    datesQuery: datesQuery.data
  }
}