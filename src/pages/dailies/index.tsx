import { Box, Button, Flex } from "@chakra-ui/react";
import DailyTasksList from "../../components/dailyTasksComponents/DailyTaskList";
import PageWrapper from "../../components/PageWrapper";
import NewDailyTaskForm from "../../components/dailyTasksComponents/NewDailyTaskForm";
import { useState } from "react";

export default function DailiesPage() {
  const [isNewDailyTaskFormOpen, setIsNewDailyTaskForm] = useState(false)

  return (
    <PageWrapper>
      <Flex
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        padding={'8px'}
        marginBottom={'24px'}
      >
        <Box as='h1' fontSize={'32px'} fontWeight={'700'}>
          Tarefas
        </Box>
        <Button onClick={() => setIsNewDailyTaskForm(true)}>+</Button>
      </Flex>
      <DailyTasksList />
      <NewDailyTaskForm
        isOpen={isNewDailyTaskFormOpen}
        onClose={() => setIsNewDailyTaskForm(false)}
      />
    </PageWrapper>
  )
}