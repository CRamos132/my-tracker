import { addDoc, arrayRemove, arrayUnion, collection, doc, updateDoc } from "firebase/firestore/lite"
import useDates from "../useDates"
import { Todo } from "../useGetTodoInCategory"
import { db } from "../../lib/firebase"
import dayjs from "dayjs"
import { useAuth } from "../../contexts/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@chakra-ui/react"

export default function useTodo(todo: Todo) {
  const { datesQuery } = useDates()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  const handleCheckTask = async (isChecked: boolean) => {
    const todayDateId = datesQuery?.[0]?.id
    if (isChecked) {
      return await updateDoc(doc(db, "dates", todayDateId as string), {
        todosChecked: arrayRemove(todo.id),
      })
    }
    if (todayDateId) {
      return await updateDoc(doc(db, "dates", todayDateId as string), {
        todosChecked: arrayUnion(todo.id),
      })
    }
    const startOfDay = dayjs().startOf('day').unix()
    const newDate = {
      createdBy: user?.uid,
      date: startOfDay,
      tasksDone: [],
      moodsChecked: [],
      todosChecked: [],
    }
    const result = await addDoc(collection(db, "dates"), newDate)
      .catch((error) => {
        return error
      });
    return result
  }

  const checkMutation = useMutation({
    mutationFn: handleCheckTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => {
      toast({
        title: "Algo deu errado.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  })

  return {
    checkMutation
  }
}