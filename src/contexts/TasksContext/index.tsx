import { addDoc, collection, getDocs, query, where } from "firebase/firestore/lite";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useAuth } from "../AuthContext";

interface ITasksContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTask: (task: Task) => Promise<any | 'success'>
  taskList: Task[]
}

export interface Task {
  id?: string
  name: string
  description: string
  repeatType: 'daily' | 'weekly' | 'monthly'
  repeatDates?: string[] | null
  createdBy: string
}

const TasksContext = createContext<ITasksContext>({
  createTask: async () => 'success',
  taskList: []
});

function TasksProvider({ children }: { children: ReactNode }) {
  const [taskList, setTaskList] = useState<Task[]>([])
  const { user } = useAuth()

  const getTasks = useCallback(async () => {
    const q = query(collection(db, "tasks"), where("createdBy", "==", user?.uid))
    const querySnapshot = await getDocs(q);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tasks: Task[] = []
    querySnapshot.forEach((doc) => {
      const tasksData = { id: doc.id, ...doc.data() } as Task
      tasks.push(tasksData)
    });
    console.log("🚀 ~ tasks:", tasks)
    setTaskList(tasks)
  }, [user?.uid])

  const handleCreateTask = async (task: Task) => {
    return await addDoc(collection(db, "tasks"), {
      ...task,
    })
      .then(() => {
        return 'success'
      })
      .catch((error) => {
        return error
      });
  }

  useEffect(() => {
    if (!user?.uid) {
      return
    }
    getTasks()
  }, [getTasks, user?.uid])

  return (
    <TasksContext.Provider
      value={{
        createTask: handleCreateTask,
        taskList
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