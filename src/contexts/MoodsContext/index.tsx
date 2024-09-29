import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import useDates from "../../hooks/useDates";
import { useAuth } from "../AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "../../lib/firebase";
import { useQuery } from "@tanstack/react-query";

export type Mood = {
  name: string
  createdBy: string
  id?: string
  isChecked?: boolean
}

interface IMoodsContext {
  moodsList: Mood[]
}

const MoodsContext = createContext<IMoodsContext>({
  moodsList: [],
});

function MoodsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { datesQuery } = useDates()

  const getMoods = useCallback(async () => {
    const q = query(collection(db, "moods"), where("createdBy", "==", user?.uid))
    const querySnapshot = await getDocs(q);
    const moods: Mood[] = []
    querySnapshot.forEach((doc) => {
      const tasksData = { id: doc.id, ...doc.data() } as Mood
      moods.push(tasksData)
    });
    return moods
  }, [user?.uid])

  const moodsQuery = useQuery({ queryKey: ['moods'], queryFn: getMoods, enabled: Boolean(user?.uid) })

  const moodsList = useMemo(() => {
    const moodsData = moodsQuery.data ?? []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moodsCheckedInDate = datesQuery?.reduce((prev: any, curr) => {
      const moodsChecked = curr.moodsChecked ?? []
      return [...prev, ...moodsChecked]
    }, [])

    const formattedMoods = moodsData.map(item => {
      const isChecked = moodsCheckedInDate.includes(item.id)
      return {
        ...item,
        isChecked
      }
    })

    return formattedMoods.sort((a, b) => b.isChecked - a.isChecked)
  }, [datesQuery, moodsQuery.data])

  return (
    <MoodsContext.Provider
      value={{
        moodsList: moodsList ?? [],
      }}
    >
      {children}
    </MoodsContext.Provider>
  )
}

function useMoods() {
  const context = useContext(MoodsContext);
  return context;
}

export { MoodsProvider, useMoods };