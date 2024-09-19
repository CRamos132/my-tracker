import { createContext, ReactNode, useCallback, useContext } from "react";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../lib/firebase";
import { useAuth } from "../AuthContext";
import { useQuery } from "@tanstack/react-query";

interface ITasksContext {
  taskList: Task[]
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

const TasksContext = createContext<ITasksContext>({
  taskList: []
});

function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

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

  return (
    <TasksContext.Provider
      value={{
        taskList: tasksQuery.data || []
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