import { Button, Flex, FormControl, FormLabel, Input, Select, useToast } from "@chakra-ui/react"
import { useAuth } from "../../../contexts/AuthContext"
import { TodoCategory } from "../../../hooks/useTodoCategories"
import { Recurrences, Todo } from "../../../hooks/useGetTodoInCategory"
import { useEffect, useState } from "react"
import LimitDateSelector from "../LimitDateSelector"

interface ITodoFormContent {
  onSubmit: (todo: Todo) => void
  todo?: Todo
  todoCategory: TodoCategory
}

export default function TodoFormContent({ onSubmit, todo, todoCategory }: ITodoFormContent) {
  const [recurrenceType, setRecurrenceType] = useState<Recurrences>(todo?.recurrence || 'weekly')
  const [dueDate, setDueDate] = useState<string | null>(null)

  const toast = useToast()
  const { user } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const newTodo = {
      name: data?.name as string,
      recurrence: recurrenceType,
      createdBy: user?.uid,
      todoCategoryId: todoCategory.id,
      ...(dueDate && { dueDate })
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

  const handleSelectChange = (event) => {
    const value = event.target.value
    setRecurrenceType(value)
  }

  useEffect(() => {
    setDueDate(null)
  }, [recurrenceType])

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
        <Select placeholder='Select option' onChange={handleSelectChange} value={todo?.recurrence || recurrenceType}>
          <option value='daily'>Diária</option>
          <option value='weekly'>Semanal</option>
          <option value='monthly'>Mensal</option>
          <option value='once'>Único</option>
        </Select>
      </FormControl>
      {
        (recurrenceType !== 'daily' && recurrenceType) && (
          <FormControl>
            <FormLabel>Data limite</FormLabel>
            <LimitDateSelector
              selectedRecurrence={recurrenceType}
              selectedDueDate={dueDate}
              setSelectedDueDate={setDueDate}
            />
          </FormControl>
        )
      }
      <Button type="submit">
        Criar
      </Button>
    </Flex>
  )
}