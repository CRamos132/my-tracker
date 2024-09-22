import { Button, Flex, FormControl, FormLabel, Input, Select, useToast } from "@chakra-ui/react"
import { useState } from "react"
import { useAuth } from "../../../contexts/AuthContext"
import { Task } from "../../../contexts/TasksContext"
import { WEEKDAYS } from "../../../consts/weekdays"

interface IDailyTaskFormContent {
  onSubmit: (task: Task) => void
  task?: Task
}

export default function DailyTaskFormContent({ onSubmit, task }: IDailyTaskFormContent) {
  const [repeatType, setRepeatType] = useState<"daily" | "weekly" | "monthly">(task?.repeatType || 'daily')
  const [repeatDates, setRepeatDates] = useState<string[]>(task?.repeatDates || [])

  const toast = useToast()
  const { user } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const newTask = {
      name: data?.name as string,
      description: data?.description as string,
      repeatType,
      repeatDates: repeatType === 'weekly' ? repeatDates : null,
      createdBy: user?.uid
    }
    if (!newTask.name || !newTask.createdBy || !newTask.repeatType) {
      toast({
        title: "Informação faltando.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return
    }

    onSubmit(newTask)
  }

  const handleSelectChange = (event) => {
    const value = event.target.value
    setRepeatType(value)
  }

  const handleWeekdaySelect = (weekday: string) => {
    return () => {
      if (repeatDates.includes(weekday)) {
        const newArray = repeatDates.filter(item => item !== weekday)
        setRepeatDates(newArray)
        return
      }
      const newArray = [...repeatDates, weekday]
      setRepeatDates(newArray)
    }
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
        <FormLabel>Nome da tarefa</FormLabel>
        <Input defaultValue={task?.name} name="name" type='text' backgroundColor={'white'} />
      </FormControl>
      <FormControl>
        <FormLabel>Descrição da tarefa</FormLabel>
        <Input defaultValue={task?.description} name="description" type='text' backgroundColor={'white'} />
      </FormControl>
      <FormControl>
        <FormLabel>Tipo de tarefa</FormLabel>
        <Select placeholder='Select option' onChange={handleSelectChange} value={task?.repeatType || repeatType}>
          <option value='daily'>Diária</option>
          <option value='weekly'>Semanal</option>
          <option value='monthly'>Mensal</option>
        </Select>
      </FormControl>
      {
        repeatType === 'weekly' && (
          <Flex direction={'row'} columnGap={'2px'}>
            {
              WEEKDAYS.map(item => {
                return (
                  <Button
                    key={item.value}
                    onClick={handleWeekdaySelect(item.value)}
                    fontSize={'14px'}
                    fontWeight={'normal'}
                    colorScheme={repeatDates.includes(item.value) ? 'blue' : 'gray'}
                  >
                    {item.label.substring(0, 3)}
                  </Button>
                )
              })
            }
          </Flex>
        )
      }
      <Button type="submit">
        Criar
      </Button>
    </Flex>
  )
}