import { Button, Flex } from "@chakra-ui/react"
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
          console.log("🚀 ~ date:", date)
          setSelectedDueDate(date)
        }}
        selectedDate={selectedDueDate ?? ''}
        setCurrentMonth={setCurrentMonth}
        month={currentMonthState}
      />
    )
  }

  return (
    <div>Aoba</div>
  )
}