import { Flex } from "@chakra-ui/react";
import Todo from "../Todo";
import { TodoCategory } from "../../../hooks/useTodoCategories";

interface IToDoCategory {
  todoCategory: TodoCategory
}

export default function ToDoCategory({ todoCategory }: IToDoCategory) {
  return (
    <Flex
      border={`1px solid var(--chakra-colors-${todoCategory.color}-600)`}
      borderRadius={'4px'}
      direction={'column'}
      backgroundColor={`${todoCategory.color}.200`}
    >
      <Flex
        fontSize={'24px'}
        padding={'8px 12px'}
        width={'100%'}
        direction={'column'}
      >
        {todoCategory.name}
      </Flex>
      <Flex direction={'column'} padding={'12px'} gap={'8px'}>
        <Todo color={todoCategory.color} />
      </Flex>
    </Flex>
  )
}