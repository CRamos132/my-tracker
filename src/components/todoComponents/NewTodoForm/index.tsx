import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import TodoFormContent from "../TodoFormContents";
import { TodoCategory } from "../../../hooks/useTodoCategories";
import { Todo } from "../../../hooks/useGetTodoInCategory";

interface INewTodoForm {
  onClose: () => void
  isOpen: boolean
  todoCategory: TodoCategory
}

export default function NewTodoForm({ isOpen, onClose, todoCategory }: INewTodoForm) {
  const toast = useToast()
  const queryClient = useQueryClient()

  const createTodo = async (todo: Todo) => {
    return await addDoc(collection(db, "todos"), {
      ...todo,
    })
      .catch((error) => {
        return error
      });
  }

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      toast({
        title: "Categoria criada com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['todos'] })
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

  const handleCreateMood = (todoCategory: Todo) => {
    mutation.mutate(todoCategory)
  }

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={'full'} placement={'bottom'}>
      <DrawerOverlay />
      <DrawerContent borderRadius={'24px 24px 0px 0px'}>
        <DrawerCloseButton />
        <DrawerHeader>
          Novo To Do
        </DrawerHeader>
        <DrawerBody>
          <TodoFormContent todoCategory={todoCategory} onSubmit={handleCreateMood} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}