import { Button, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import { useAuth } from "../../../contexts/AuthContext"
import { TodoCategory } from "../../../hooks/useTodoCategories"

interface ITodoFormContent {
  onSubmit: (todo: TodoCategory) => void
  todo?: TodoCategory
}

const COLORS = ['red', 'blue', 'green', 'yellow', 'gray']

export default function TodoCategoryFormContent({ onSubmit, todo }: ITodoFormContent) {

  const toast = useToast()
  const { user } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const newTodo = {
      name: data?.name as string,
      color: '',
      createdBy: user?.uid
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
        <FormLabel>Nome da categoria</FormLabel>
        <Input defaultValue={todo?.name} name="name" type='text' backgroundColor={'white'} />
      </FormControl>
      <FormControl>
        <FormLabel>Cor da categoria</FormLabel>
        <Flex direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          {
            COLORS.map(item => {
              return (
                <Button backgroundColor={`${item}.300`} border={`2px solid var(--chakra-colors-${item}-600)`} key={item} />
              )
            })
          }
        </Flex>
      </FormControl>
      <Button type="submit">
        Criar
      </Button>
    </Flex>
  )
}