import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

interface INewDailyTaskForm {
  onClose: () => void
  isOpen: boolean
}

const weekdays = [
  {
    value: 'sunday',
    label: 'Domingo'
  },
  {
    value: 'monday',
    label: 'Segunda'
  },
  {
    value: 'thuesday',
    label: 'Terça'
  },
  {
    value: 'wednesday',
    label: 'Quarta'
  },
  {
    value: 'thursday',
    label: 'Quinta'
  },
  {
    value: 'friday',
    label: 'Sexta'
  },
  {
    value: 'saturday',
    label: 'Sábado'
  }
]

export default function NewDailyTaskForm({ isOpen, onClose }: INewDailyTaskForm) {
  const [repeatType, setRepeatType] = useState('daily')
  const [repeatDates, setRepeatDates] = useState<string[]>([])

  const { user } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    console.log("🚀 ~ user:", user)
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    console.log("🚀 ~ data:", data)
    const newTask = {
      name: data?.name,
      description: data?.description,
      repeatType,
      repeatDates: repeatType === 'weekly' ? repeatDates : null,
      createdBy: user?.uid
    }
    console.log("🚀 ~ newTask:", newTask)
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
    <Drawer onClose={onClose} isOpen={isOpen} size={'full'} placement={'bottom'}>
      <DrawerOverlay />
      <DrawerContent borderRadius={'24px 24px 0px 0px'}>
        <DrawerCloseButton />
        <DrawerHeader>
          Nova tarefa
        </DrawerHeader>
        <DrawerBody>
          <Flex
            direction={'column'}
            gridRowGap={'16px'}
            padding={'16px'}
            as='form'
            onSubmit={handleForm}
          >
            <FormControl>
              <FormLabel>Nome da tarefa</FormLabel>
              <Input name="name" type='text' backgroundColor={'white'} />
            </FormControl>
            <FormControl>
              <FormLabel>Descrição da tarefa</FormLabel>
              <Input name="description" type='text' backgroundColor={'white'} />
            </FormControl>
            <FormControl>
              <FormLabel>Tipo de tarefa</FormLabel>
              <Select placeholder='Select option' onChange={handleSelectChange} value={repeatType}>
                <option value='daily'>Diária</option>
                <option value='weekly'>Semanal</option>
                <option value='monthly'>Mensal</option>
              </Select>
            </FormControl>
            {
              repeatType === 'weekly' && (
                <Flex direction={'row'} columnGap={'2px'}>
                  {
                    weekdays.map(item => {
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}