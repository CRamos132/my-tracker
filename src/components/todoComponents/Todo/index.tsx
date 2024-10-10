import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { Todo as TodoType } from "../../../hooks/useGetTodoInCategory";

interface ITodo {
  color: string
  todo: TodoType
}

export default function Todo({ color, todo }: ITodo) {

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
        {todo.name}
      </Text>
    </Flex>
  )
}