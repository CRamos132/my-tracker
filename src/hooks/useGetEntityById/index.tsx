import { collection, doc, documentId, getDoc, getDocs, query, where } from "firebase/firestore/lite";
import { Entities } from "../../types/entities";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Date } from "../useDates";
import { Task } from "../../contexts/TasksContext";
import { useQuery } from "@tanstack/react-query";

export default function useGetEntityById(entityId: string | string[], entityType: Entities) {
  const { user } = useAuth()

  // TODO: accept more than 10 IDs
  const getEntityById = async () => {
    if (Array.isArray(entityId)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = query(collection(db, entityType), where("createdBy", "==", user?.uid), where(documentId(), "in", entityId))
      const querySnapshot = await getDocs(q);
      const entities: Date[] | Task[] = []
      querySnapshot.forEach((doc) => {
        const tasksData = { id: doc.id, ...doc.data() }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        entities.push(tasksData as any)
      });
      return entities
    }
    const eventDocRef = doc(db, entityType, entityId as string);
    const eventDocSnap = await getDoc(eventDocRef);
    const document = [{ id: eventDocSnap.data() && eventDocSnap.id, ...eventDocSnap.data() }] as Date[] | Task[]
    return document;
  }

  const entityQuery = useQuery({ queryKey: [entityId, entityType], queryFn: getEntityById, enabled: Boolean(user?.uid) })

  return {
    getEntityById: entityQuery.data
  }
}