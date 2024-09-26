import { Button, Flex, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import { useAuth } from "../../../contexts/AuthContext"
import { Mood } from "../../../contexts/MoodsContext"

interface INewMoodFormContent {
  onSubmit: (mood: Mood) => void
  mood?: Mood
}

export default function NewMoodFormContent({ onSubmit, mood }: INewMoodFormContent) {

  const toast = useToast()
  const { user } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    const newMood = {
      name: data?.name as string,
      createdBy: user?.uid
    }
    if (!newMood.name) {
      toast({
        title: "Informação faltando.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return
    }

    onSubmit(newMood)
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
        <FormLabel>Nome do mood</FormLabel>
        <Input defaultValue={mood?.name} name="name" type='text' backgroundColor={'white'} />
      </FormControl>
      <Button type="submit">
        Criar
      </Button>
    </Flex>
  )
}