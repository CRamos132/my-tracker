import { Flex } from "@chakra-ui/react"
import MenuLink from "../MenuLink"

export default function Menu() {
  return (
    <Flex
      position={'fixed'}
      bottom={'0px'}
      width={'100vw'}
      height={'80px'}
      backgroundColor={'gray.200'}
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-around'}
    >
      <MenuLink href="/moods">
        Mood
      </MenuLink>
      <MenuLink href="/dailies">
        Diárias
      </MenuLink>
      <MenuLink href="/todos">
        To do
      </MenuLink>
    </Flex>
  )
}