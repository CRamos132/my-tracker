import { Box, Button, Flex } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import NewTodoForm from "../../components/todoComponents/NewTodoForm";
import { useState } from "react";
import TodoCategoryList from "../../components/todoComponents/TodoCategoryList";

export default function TodoPage() {
  const [isNewTodoFormOpen, setIsNewTodoFormOpen] = useState(false)

  return (
    <PageWrapper>
      <Flex
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        padding={'8px'}
      >
        <Box as='h1' fontSize={'32px'} fontWeight={'700'}>
          To-dos
        </Box>
        <Button onClick={() => setIsNewTodoFormOpen(true)}>+</Button>
      </Flex>
      <TodoCategoryList />
      <NewTodoForm isOpen={isNewTodoFormOpen} onClose={() => setIsNewTodoFormOpen(false)} />
    </PageWrapper>
  )
}