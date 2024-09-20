import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDoc, doc, updateDoc } from "firebase/firestore/lite"
import { db } from "../../lib/firebase"
import { Task } from "../../contexts/TasksContext"
import { useState } from "react"
import { useDisclosure, useToast } from "@chakra-ui/react"

interface IUseDailyTask {
  handleSubmit: (task: Task) => void
  handleDisable: () => void
  handleDelete: () => void
  isEditOpen: boolean
  isDeleteOpen: boolean
  onDeleteOpen: () => void
  setIsEditOpen: (isOpen: boolean) => void
  onDeleteClose: () => void
}

export default function useDailyTask(task: Task): IUseDailyTask {
  const [isEditOpen, setIsEditOpen] = useState(false)

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
  return {
    handleSubmit,
    handleDisable,
    handleDelete,
    isEditOpen,
    isDeleteOpen: isOpen,
    onDeleteOpen: onOpen,
    onDeleteClose: onClose,
    setIsEditOpen
  }
}