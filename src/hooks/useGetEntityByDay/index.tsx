import { useMemo } from "react"
import { Entities } from "../../types/entities"
import useDates from "../useDates"
import useGetEntityById from "../useGetEntityById"

interface IUseGetEntityByDayProps {
  date: string
  entity: Entities
}

export default function useGetEntityByDay({ date, entity }: IUseGetEntityByDayProps) {
  const { datesQuery } = useDates(Number(date) * 1000)

  const enititiesId = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const idsFromDates = datesQuery?.reduce((prev: any, curr) => {
      const currentIdsArray = entity === 'moods' ? curr?.moodsChecked : curr?.tasksDone
      if (!currentIdsArray?.length) {
        return prev
      }
      const newArray = [...prev]

      currentIdsArray.forEach(item => {
        if (newArray.includes(item)) {
          return
        }
        newArray.push(item)
      })

      return newArray
    }, [])
    return idsFromDates
  }, [datesQuery, entity])

  const { getEntityById } = useGetEntityById(enititiesId, entity)

  return {
    entities: getEntityById ?? []
  }
}