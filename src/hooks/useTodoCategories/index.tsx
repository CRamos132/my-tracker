import { useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext"
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../lib/firebase";
import { useQuery } from "@tanstack/react-query";

export type TodoCategory = {
  name: string
  createdBy?: string
  color: string
  id?: string
}

export default function useTodoCategories() {
  const { user } = useAuth()

  const getTodoCategories = useCallback(async () => {
    const q = query(collection(db, "todoCategories"), where("createdBy", "==", user?.uid))
    const querySnapshot = await getDocs(q);
    const todoCategories: TodoCategory[] = []
    querySnapshot.forEach((doc) => {
      const todoCategoriesData = { id: doc.id, ...doc.data() } as TodoCategory
      todoCategories.push(todoCategoriesData)
    });
    return todoCategories
  }, [user?.uid])

  const todoCategoriesQuery = useQuery({ queryKey: ['todoCategories'], queryFn: getTodoCategories, enabled: Boolean(user?.uid) })

  return {
    todoCategories: todoCategoriesQuery.data ?? []
  }
}