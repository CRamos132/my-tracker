import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useToast } from "@chakra-ui/react";
import { Task } from "../../../contexts/TasksContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import DailyTaskFormContent from "../DailyTaskFormContent";

interface IEditDailyTaskForm {
  onClose: () => void
  isOpen: boolean
}

export default function EditDailyTaskForm({ isOpen, onClose }: IEditDailyTaskForm) {

  const toast = useToast()
  const queryClient = useQueryClient()

  const createTask = async (task: Task) => {
    return await addDoc(collection(db, "tasks"), {
      ...task,
    })
      .catch((error) => {
        return error
      });
  }

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: "Tarefa criada com sucesso.",
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

  const handleCreateTask = (task: Task) => {
    mutation.mutate(task)
  }

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={'full'} placement={'bottom'}>
      <DrawerOverlay />
      <DrawerContent borderRadius={'24px 24px 0px 0px'}>
        <DrawerCloseButton />
        <DrawerHeader>
          Nova tarefa
        </DrawerHeader>
        <DrawerBody>
          <DailyTaskFormContent onSubmit={handleCreateTask} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}