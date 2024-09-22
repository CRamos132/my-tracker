import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from "firebase/firestore/lite"
import { db } from "../../lib/firebase"
import { Task } from "../../contexts/TasksContext"
import { useState } from "react"
import { useDisclosure, useToast } from "@chakra-ui/react"
import useDates from "../useDates"
import { useAuth } from "../../contexts/AuthContext"
import dayjs from "dayjs"

interface IUseDailyTask {
  handleSubmit: (task: Task) => void
  handleDisable: () => void
  handleDelete: () => void
  isEditOpen: boolean
  isDeleteOpen: boolean
  onDeleteOpen: () => void
  setIsEditOpen: (isOpen: boolean) => void
  onDeleteClose: () => void
  checkMutation: () => void
}

export default function useDailyTask(task: Task): IUseDailyTask {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { datesQuery } = useDates()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const queryClient = useQueryClient()

  const editTask = async (editedTask: Task) => {
    return await updateDoc(doc(db, "tasks", task.id as string), {
      ...editedTask,
    })
      .catch((error) => {
        return error
      });
  }

  const deleteTask = async () => {
    return await deleteDoc(doc(db, "tasks", task.id as string))
      .catch(error => error)
  }

  const mutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      toast({
        title: "Tarefa editada com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setIsEditOpen(false)
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

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: "Tarefa deletada com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onClose()
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

  const handleCheckTask = async () => {
    const todayDateId = datesQuery?.[0]?.id
    if (todayDateId) {
      return await updateDoc(doc(db, "dates", todayDateId as string), {
        tasksDone: arrayUnion(task.id),
      })
    }
    const startOfDay = dayjs().startOf('day').unix()
    const newDate = {
      createdBy: user?.uid,
      date: startOfDay,
      tasksDone: [task?.id]
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
      queryClient.invalidateQueries({ queryKey: ['dates'] })
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

  const handleSubmit = (editedTask: Task) => {
    mutation.mutate(editedTask)
  }

  const handleDisable = () => {
    mutation.mutate({
      ...task,
      isDisabled: !task?.isDisabled
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  const handleCheck = () => {
    checkMutation.mutate()
  }

  return {
    handleSubmit,
    handleDisable,
    handleDelete,
    isEditOpen,
    isDeleteOpen: isOpen,
    onDeleteOpen: onOpen,
    onDeleteClose: onClose,
    setIsEditOpen,
    checkMutation: handleCheck
  }
}