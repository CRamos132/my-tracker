import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useToast } from "@chakra-ui/react";
import TodoCategoryFormContent from "../TodoCategoryFormContent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import { TodoCategory } from "../../../hooks/useTodoCategories";

interface INewTodoForm {
  onClose: () => void
  isOpen: boolean
}

export default function NewTodoForm({ isOpen, onClose }: INewTodoForm) {
  const toast = useToast()
  const queryClient = useQueryClient()

  const createTodoCategory = async (todoCategody: TodoCategory) => {
    return await addDoc(collection(db, "todoCategories"), {
      ...todoCategody,
    })
      .catch((error) => {
        return error
      });
  }

  const mutation = useMutation({
    mutationFn: createTodoCategory,
    onSuccess: () => {
      toast({
        title: "Categoria criada com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['todoCategories'] })
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

  const handleCreateMood = (todoCategory: TodoCategory) => {
    mutation.mutate(todoCategory)
  }

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={'full'} placement={'bottom'}>
      <DrawerOverlay />
      <DrawerContent borderRadius={'24px 24px 0px 0px'}>
        <DrawerCloseButton />
        <DrawerHeader>
          Nova Categoria
        </DrawerHeader>
        <DrawerBody>
          <TodoCategoryFormContent onSubmit={handleCreateMood} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}