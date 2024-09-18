import { Checkbox, Flex } from "@chakra-ui/react";

export default function DailyTask() {
  return (
    <Flex
      border={'1px solid black'}
      direction={'row'}
      backgroundColor={'gray.200'}
    >
      <Flex
        padding={'8px'}
        backgroundColor={'gray.300'}
      >
        <Checkbox
          size={'lg'}
        />
      </Flex>
      <Flex
        fontSize={'24px'}
        padding={'8px 12px'}
      >
        Minha tarefa
      </Flex>
    </Flex>
  )
}