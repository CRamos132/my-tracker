import { Button, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import { useAuth } from "../../../contexts/AuthContext"
import { TodoCategory } from "../../../hooks/useTodoCategories"

type Recurrences = 'daily' | 'weekly' | 'monthly' | 'once'

export type Todo = {
  name: string
  createdBy?: string
  recurrence: Recurrences
  todoCategoryId?: string
  id?: string
}

interface ITodoFormContent {
  onSubmit: (todo: Todo) => void
  todo?: Todo
  todoCategory: TodoCategory
}

export default function TodoFormContent({ onSubmit, todo, todoCategory }: ITodoFormContent) {

  const toast = useToast()
  const { user } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const newTodo = {
      name: data?.name as string,
      recurrence: 'daily' as Recurrences,
      createdBy: user?.uid,
      todoCategoryId: todoCategory.id
    }
    if (!newTodo.name || !newTodo.createdBy) {
      toast({
        title: "Informação faltando.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return
    }

    onSubmit(newTodo)
  }

  return (
    <Flex
      direction={'column'}
      gridRowGap={'16px'}
      padding={'16px'}
      as='form'
      onSubmit={handleForm}
    >
      <FormControl>
        <FormLabel>Nome do todo</FormLabel>
        <Input defaultValue={todo?.name} name="name" type='text' backgroundColor={'white'} />
      </FormControl>
      <FormControl>
        <FormLabel>Recorrência</FormLabel>
      </FormControl>
      <Button type="submit">
        Criar
      </Button>
    </Flex>
  )
}