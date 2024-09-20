import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../lib/firebase";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";
import useDates from "../../hooks/useDates";

interface ITasksContext {
  taskList: Task[]
  categorizedTasksList: ICategorizedTasksList
}

export interface Task {
  id?: string
  name: string
  description: string
  repeatType: 'daily' | 'weekly' | 'monthly'
  repeatDates?: string[] | null
  isDisabled?: boolean
  createdBy: string
}

export interface ICategorizedTasksList {
  pending: Task[]
  done: Task[]
  disabled: Task[]
}

export type TaskStatus = 'done' | 'disabled' | 'pending'

const EMPTY_CATEGORIZED_TASK_LIST = {
  pending: [],
  done: [],
  disabled: []
}

const TasksContext = createContext<ITasksContext>({
  taskList: [],
  categorizedTasksList: EMPTY_CATEGORIZED_TASK_LIST
});

function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { datesQuery } = useDates()

  const getTasks = useCallback(async () => {
    const q = query(collection(db, "tasks"), where("createdBy", "==", user?.uid))
    const querySnapshot = await getDocs(q);
    const tasks: Task[] = []
    querySnapshot.forEach((doc) => {
      const tasksData = { id: doc.id, ...doc.data() } as Task
      tasks.push(tasksData)
    });
    return tasks
  }, [user?.uid])

  const tasksQuery = useQuery({ queryKey: ['tasks'], queryFn: getTasks })



  const categorizedTasksList: ICategorizedTasksList = useMemo(() => {
    const datesData = datesQuery ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasksDoneInDate = datesData?.reduce((prev: any, curr) => {
      const tasksDone = curr.tasksDone ?? []
      return [...prev, ...tasksDone]
    }, [])

    const list = tasksQuery.data ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const separatedList = list.reduce((prev: any, curr) => {
      if (curr.isDisabled) {
        return {
          ...prev,
          disabled: [...prev.disabled, curr]
        }
      }
      if (tasksDoneInDate.includes(curr.id)) {
        return {
          ...prev,
          done: [...prev.done, curr]
        }
      }
      return {
        ...prev,
        pending: [...prev.pending, curr]
      }
    }, EMPTY_CATEGORIZED_TASK_LIST)
    return separatedList
  }, [datesQuery, tasksQuery.data])

  return (
    <TasksContext.Provider
      value={{
        taskList: tasksQuery.data || [],
        categorizedTasksList: categorizedTasksList || EMPTY_CATEGORIZED_TASK_LIST
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

function useTasks() {
  const context = useContext(TasksContext);
  return context;
}

export { TasksProvider, useTasks };