import { Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { WEEKDAYS } from "../../consts/weekdays";
import { useMemo } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { Entities } from "../../types/entities";

interface ICalendarHeader {
  weekday: string
}

function CalendarHeader({ weekday }: ICalendarHeader) {
  return (
    <GridItem
      w='100%'
      h='25px'
      borderRadius={'4px'}
      bg='gray.100'
      textAlign={'center'}
      border={'1px solid var(--chakra-colors-gray-500)'}
    >
      {weekday.substring(0, 3)}
    </GridItem>
  )
}

interface ICalendar {
  filledDates?: number[]
  entityType?: Entities
  month?: string | null
  setCurrentMonth?: (operation: 'add' | 'subtract') => void
  clickDate?: (date: string) => void
  selectedDate?: string
}

export default function Calendar({ filledDates = [], entityType, month, setCurrentMonth, clickDate, selectedDate }: ICalendar) {
  const currentMonth = month ?? dayjs()

  const monthDays = useMemo(() => {
    const daysInMonth = dayjs(currentMonth).daysInMonth()
    const startOfMonth = dayjs(currentMonth).startOf('month')
    const datesArray = Array(daysInMonth).fill(null)

    const monthDates = datesArray.reduce((prev) => {
      if (!prev.length) {
        return [
          ...prev,
          {
            date: startOfMonth.format('MM/DD/YYYY'),
            weekday: dayjs(startOfMonth).day(),
            label: dayjs(startOfMonth).format('DD'),
            rawDate: dayjs(startOfMonth).unix()
          }
        ]
      }

      const previousDate = prev?.[prev.length - 1]
      const currentDate = dayjs(previousDate.date).add(1, 'day')

      return [
        ...prev,
        {
          date: currentDate.format('MM/DD/YYYY'),
          weekday: dayjs(currentDate).day(),
          label: dayjs(currentDate).format('DD'),
          rawDate: dayjs(currentDate).unix()
        }
      ]
    }, [])

    const emptyDaysCount = Array(monthDates?.[0]?.weekday).fill(null)
    const emptyDays = emptyDaysCount.map((item, index) => {
      return {
        date: '',
        weekday: index,
        label: ''
      }
    })

    return [...emptyDays, ...monthDates]
  }, [currentMonth])

  const formattedFilledDates = useMemo(() => {
    return filledDates.map(item => dayjs(item * 1000).format('MM/DD/YYYY'))
  }, [filledDates])

  const today = dayjs().startOf('day').format('MM/DD/YYYY')

  return (
    <Flex direction={'column'} padding={'16px'}>
      <Flex
        direction={'row'}
        alignItems={'center'}
        gap={'8px'}
        marginBottom={'8px'}
      >
        {
          Boolean(setCurrentMonth) && (
            <Button
              onClick={() => setCurrentMonth?.('subtract')}
              h='25px'
              w='25px'
              bg='gray.100'
              variant={'outline'}
              border={'1px solid var(--chakra-colors-gray-500)'}
            >
              {'<'}
            </Button>
          )
        }
        <Flex
          h='25px'
          borderRadius={'4px'}
          bg='gray.100'
          alignItems={'center'}
          justifyContent={'center'}
          width={'100%'}
          border={'1px solid var(--chakra-colors-gray-500)'}
        >
          {dayjs(currentMonth).format('MMMM')}
        </Flex>
        {
          Boolean(setCurrentMonth) && (
            <Button
              onClick={() => setCurrentMonth?.('add')}
              h='25px'
              w='25px'
              bg='gray.100'
              variant={'outline'}
              border={'1px solid var(--chakra-colors-gray-500)'}
            >
              {'>'}
            </Button>
          )
        }
      </Flex>
      <Grid templateColumns='repeat(7, 1fr)' gap='8px' marginBottom={'8px'}>
        {
          WEEKDAYS.map(item => {
            return (
              <CalendarHeader weekday={item.label} key={item.value} />
            )
          })
        }
      </Grid>
      <Grid templateColumns='repeat(7, 1fr)' gap='8px'>
        {
          monthDays.map((item, index) => {
            const isDayDone = formattedFilledDates.includes(item?.date)
            const isDateToday = today === item.date

            if (Boolean(clickDate)) {
              const isDateSelected = selectedDate === item.date

              return (
                <GridItem
                  w='100%'
                  h='50px'
                  borderRadius={'4px'}
                  backgroundColor={isDateSelected ? 'green.300' : 'gray.100'}
                  _hover={{ bg: isDateSelected ? 'green.300' : 'gray.100' }}
                  textAlign={'center'}
                  border={`${isDateToday ? '2px' : '1px'} solid ${isDateToday ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-gray-500)'}`}
                  key={index}
                  as={Button}
                  onClick={() => clickDate?.(item.date)}
                >
                  {item.label}
                </GridItem>
              )
            }

            return (
              <GridItem
                w='100%'
                h='50px'
                borderRadius={'4px'}
                bg={isDayDone ? 'green.300' : 'gray.100'}
                textAlign={'center'}
                border={`${isDateToday ? '2px' : '1px'} solid ${isDateToday ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-gray-500)'}`}
                key={index}
                as={Link}
                href={`/calendar/${encodeURIComponent(item.rawDate)}/${entityType}`}
              >
                {item.label}
              </GridItem>
            )
          })
        }
      </Grid>
    </Flex>
  )
}