import { Checkbox, Flex, Text } from "@chakra-ui/react";

interface ITodo {
  color: string
}

export default function Todo({ color }: ITodo) {
  return (
    <Flex
      direction={'row'}
      border={`1px solid var(--chakra-colors-${color}-600)`}
      borderRadius={'4px'}
      backgroundColor={`${color}.300`}
      padding={'8px'}
    >
      <Checkbox
        size={'md'}
      />
      <Text marginLeft={'4px'}>
        Minha to do
      </Text>
    </Flex>
  )
}