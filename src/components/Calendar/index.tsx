import { Flex, Grid, GridItem } from "@chakra-ui/react";
import { WEEKDAYS } from "../../consts/weekdays";
import { useMemo } from "react";
import dayjs from "dayjs";

interface ICalendarHeader {
  weekday: string
}

function CalendarHeader({ weekday }: ICalendarHeader) {
  return (
    <GridItem w='100%' h='25px' bg='blue.500' textAlign={'center'}>
      {weekday.substring(0, 3)}
    </GridItem>
  )
}

interface ICalendar {
  filledDates: number[]
}

export default function Calendar({ filledDates }: ICalendar) {
  const monthDays = useMemo(() => {
    const daysInMonth = dayjs().daysInMonth()
    const startOfMonth = dayjs().startOf('month')
    const datesArray = Array(daysInMonth).fill(null)

    const monthDates = datesArray.reduce((prev) => {
      if (!prev.length) {
        return [
          ...prev,
          {
            date: startOfMonth.format('MM/DD/YYYY'),
            weekday: dayjs(startOfMonth).day(),
            label: dayjs(startOfMonth).format('DD')
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
          label: dayjs(currentDate).format('DD')
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
  }, [])

  const formattedFilledDates = useMemo(() => {
    return filledDates.map(item => dayjs(item * 1000).format('MM/DD/YYYY'))
  }, [filledDates])

  return (
    <Flex direction={'column'} padding={'16px'}>
      <Flex h='25px' bg='blue.500' alignItems={'center'} justifyContent={'center'} marginBottom={'8px'}>
        {dayjs().format('MMMM')}
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
            return (
              <GridItem w='100%' h='50px' bg={isDayDone ? 'green.500' : 'blue.500'} textAlign={'center'} key={index}>
                {item.label}
              </GridItem>
            )
          })
        }
      </Grid>
    </Flex>
  )
}