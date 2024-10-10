import { useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../lib/firebase";
import { useQuery } from "@tanstack/react-query";

export type Recurrences = 'daily' | 'weekly' | 'monthly' | 'once'

export type Todo = {
  name: string
  createdBy?: string
  recurrence: Recurrences
  todoCategoryId?: string
  id?: string
}

interface IUseGetTodoInCategory {
  todoCategoryId: string
}

export default function useGetTodoInCategory({ todoCategoryId }: IUseGetTodoInCategory) {
  const { user } = useAuth()

  const getTodoCategories = useCallback(async () => {
    const q = query(collection(db, "todos"), where("createdBy", "==", user?.uid), where("todoCategoryId", "==", todoCategoryId))
    const querySnapshot = await getDocs(q);
    const todoCategories: Todo[] = []
    querySnapshot.forEach((doc) => {
      const todoCategoriesData = { id: doc.id, ...doc.data() } as Todo
      todoCategories.push(todoCategoriesData)
    });
    return todoCategories
  }, [todoCategoryId, user?.uid])

  const todoQuery = useQuery({ queryKey: ['todos', todoCategoryId], queryFn: getTodoCategories, enabled: Boolean(user?.uid) })

  return {
    todos: todoQuery.data ?? []
  }
}