import { Button, Flex } from "@chakra-ui/react";
import Todo from "../Todo";
import { TodoCategory } from "../../../hooks/useTodoCategories";
import NewTodoForm from "../NewTodoForm";
import { useState } from "react";
import useGetTodoInCategory from "../../../hooks/useGetTodoInCategory";

interface IToDoCategory {
  todoCategory: TodoCategory
}

export default function ToDoCategory({ todoCategory }: IToDoCategory) {
  const [isNewTodoOpen, setIsNewTodoOpen] = useState(false)

  const { todos } = useGetTodoInCategory({ todoCategoryId: todoCategory.id as string })

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
        <Flex direction={'column'} gap={'8px'} maxHeight={'450px'}>
          {
            todos.map(item => {
              return (
                <Todo key={item.id} todo={item} color={todoCategory.color} />
              )
            })
          }
        </Flex>
        <Button onClick={() => setIsNewTodoOpen(true)}>
          +
        </Button>
      </Flex>
      <NewTodoForm todoCategory={todoCategory} isOpen={isNewTodoOpen} onClose={() => setIsNewTodoOpen(false)} />
    </Flex>
  )
}