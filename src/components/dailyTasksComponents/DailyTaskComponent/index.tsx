import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { Task } from "../../../contexts/TasksContext";
import DailyTask from "../DailyTask";
import DailyTaskFormContent from "../DailyTaskFormContent";
import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IDailyTaskComponent {
  task: Task
}

export default function DailyTaskComponent({ task }: IDailyTaskComponent) {
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

  return (
    <>
      <DailyTask
        task={task}
        handleEdit={() => setIsEditOpen(true)}
        handleDisable={handleDisable}
        handleDelete={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Você deseja deletar esta tarefa?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Esta ação não poderá ser desfeita
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme='red' onClick={handleDelete}>Deletar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer onClose={() => setIsEditOpen(false)} isOpen={isEditOpen} size={'full'} placement={'bottom'}>
        <DrawerOverlay />
        <DrawerContent borderRadius={'24px 24px 0px 0px'}>
          <DrawerCloseButton />
          <DrawerHeader>
            Editar tarefa
          </DrawerHeader>
          <DrawerBody>
            <DailyTaskFormContent task={task} onSubmit={handleSubmit} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}