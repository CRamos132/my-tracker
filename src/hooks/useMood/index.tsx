import { useState } from "react"
import { Mood } from "../../contexts/MoodsContext"
import useDates from "../useDates"
import { useAuth } from "../../contexts/AuthContext"
import { useDisclosure, useToast } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, updateDoc } from "firebase/firestore/lite"
import { db } from "../../lib/firebase"
import dayjs from "dayjs"

interface IUseMood {
  handleSubmit: (mood: Mood) => void
  handleDelete: () => void
  isEditOpen: boolean
  isDeleteOpen: boolean
  onDeleteOpen: () => void
  setIsEditOpen: (isOpen: boolean) => void
  onDeleteClose: () => void
  checkMutation: (isChecked: boolean) => void
}

export default function useMood(mood: Mood): IUseMood {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { datesQuery } = useDates()
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const queryClient = useQueryClient()

  const editTask = async (editedMood: Mood) => {
    return await updateDoc(doc(db, "moods", mood.id as string), {
      ...editedMood,
    })
      .catch((error) => {
        return error
      });
  }

  const deleteTask = async () => {
    return await deleteDoc(doc(db, "moods", mood.id as string))
      .catch(error => error)
  }

  const mutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      toast({
        title: "Mood editado com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['moods'] })
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
        title: "Mood deletado com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['moods'] })
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

  const handleCheckTask = async (isChecked: boolean) => {
    const todayDate = datesQuery?.[0]
    const todayDateId = todayDate?.id
    if (isChecked) {
      return await updateDoc(doc(db, "dates", todayDateId as string), {
        moodsChecked: arrayRemove(mood.id),
      })
    }
    if (todayDateId) {
      return await updateDoc(doc(db, "dates", todayDateId as string), {
        moodsChecked: arrayUnion(mood.id),
      })
    }
    const startOfDay = dayjs().startOf('day').unix()
    const newDate = {
      createdBy: user?.uid,
      date: startOfDay,
      tasksDone: [],
      moodsChecked: [mood?.id],
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

  const handleSubmit = (editedTask: Mood) => {
    mutation.mutate(editedTask)
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  const handleCheck = (isChecked: boolean) => {
    checkMutation.mutate(isChecked)
  }

  return {
    handleSubmit,
    handleDelete,
    isEditOpen,
    isDeleteOpen: isOpen,
    onDeleteOpen: onOpen,
    onDeleteClose: onClose,
    setIsEditOpen,
    checkMutation: handleCheck
  }
}