import { Button, Flex, Grid, GridItem } from "@chakra-ui/react"
import { Recurrences } from "../../../hooks/useGetTodoInCategory"
import { WEEKDAYS } from "../../../consts/weekdays"
import Calendar from "../../Calendar"
import { useState } from "react"
import dayjs from "dayjs"

interface ILimitDateSelector {
  selectedRecurrence: Recurrences
  selectedDueDate: string | null
  setSelectedDueDate: (date: string) => void
}

export default function LimitDateSelector({ selectedRecurrence, selectedDueDate, setSelectedDueDate }: ILimitDateSelector) {
  const [currentMonthState, setCurrentMonthState] = useState<null | string>(null)

  const handleSelect = (date) => {
    return () => {
      setSelectedDueDate(date)
    }
  }

  const setCurrentMonth = (operation: 'add' | 'subtract') => {
    const currentState = currentMonthState ?? dayjs()
    const month = dayjs(currentState)
    if (operation === 'add') {
      const updatedMonth = dayjs(month).add(1, 'month').format('MMM YYYY')
      setCurrentMonthState(updatedMonth)
      return
    }
    const updatedMonth = dayjs(month).subtract(1, 'month').format('MMM YYYY')
    setCurrentMonthState(updatedMonth)
    return
  }

  if (selectedRecurrence === 'weekly') {
    return (
      <Flex direction={'row'} columnGap={'2px'}>
        {
          WEEKDAYS.map(item => {
            return (
              <Button
                key={item.value}
                onClick={handleSelect(item.value)}
                fontSize={'14px'}
                fontWeight={'normal'}
                colorScheme={selectedDueDate === item.value ? 'blue' : 'gray'}
              >
                {item.label.substring(0, 3)}
              </Button>
            )
          })
        }
      </Flex>
    )
  }

  if (selectedRecurrence === 'once') {
    return (
      <Calendar
        clickDate={(date) => {
          setSelectedDueDate(date)
        }}
        selectedDate={selectedDueDate ?? ''}
        setCurrentMonth={setCurrentMonth}
        month={currentMonthState}
      />
    )
  }

  if (selectedRecurrence === 'monthly') {
    const monthDays = Array.from(Array(31).keys())

    return (
      <Grid templateColumns='repeat(7, 1fr)' gap='8px'>
        {
          monthDays.map(item => {
            const day = item + 1
            const isDateSelected = String(day) === selectedDueDate
            return (
              <GridItem
                w='100%'
                h='50px'
                borderRadius={'4px'}
                backgroundColor={isDateSelected ? 'green.300' : 'gray.100'}
                _hover={{ bg: isDateSelected ? 'green.300' : 'gray.100' }}
                textAlign={'center'}
                border={`1px solid var(--chakra-colors-gray-500)`}
                key={item}
                as={Button}
                onClick={() => setSelectedDueDate(String(day))}
              >
                {day}
              </GridItem>
            )
          })
        }
      </Grid>
    )
  }

  return (
    <div>Aoba</div>
  )
}