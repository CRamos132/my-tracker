import { addDoc, collection } from "firebase/firestore/lite";
import { createContext, ReactNode, useContext } from "react";
import { db } from "../../lib/firebase";

interface ITasksContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTask: (task: Task) => Promise<any | 'success'>
}

export interface Task {
  name: string
  description: string
  repeatType: 'daily' | 'weekly' | 'monthly'
  repeatDates?: string[] | null
  createdBy: string
}

const TasksContext = createContext<ITasksContext>({
  createTask: async () => 'success',
});

function TasksProvider({ children }: { children: ReactNode }) {
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

  return (
    <TasksContext.Provider
      value={{
        createTask: handleCreateTask
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