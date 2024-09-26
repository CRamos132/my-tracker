import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useToast } from "@chakra-ui/react";
import NewMoodFormContent from "../NewMoodFormContent";
import { addDoc, collection } from "firebase/firestore/lite";
import { db } from "../../../lib/firebase";
import { Mood } from "../../../contexts/MoodsContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface INewMoodForm {
  onClose: () => void
  isOpen: boolean
}

export default function NewMoodForm({ isOpen, onClose }: INewMoodForm) {
  const toast = useToast()
  const queryClient = useQueryClient()

  const createMood = async (mood: Mood) => {
    console.log("🚀 ~ mood:", mood)
    return await addDoc(collection(db, "moods"), {
      ...mood,
    })
      .catch((error) => {
        return error
      });
  }

  const mutation = useMutation({
    mutationFn: createMood,
    onSuccess: () => {
      toast({
        title: "Mood criado com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['moods'] })
      onClose()
    },
    onError: (error) => {
      toast({
        title: "Algo deu errado.",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  })

  const handleCreateMood = (mood: Mood) => {
    mutation.mutate(mood)
  }

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={'full'} placement={'bottom'}>
      <DrawerOverlay />
      <DrawerContent borderRadius={'24px 24px 0px 0px'}>
        <DrawerCloseButton />
        <DrawerHeader>
          Novo mood
        </DrawerHeader>
        <DrawerBody>
          <NewMoodFormContent onSubmit={handleCreateMood} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}