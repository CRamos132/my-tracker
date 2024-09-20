import { Flex, Heading } from "@chakra-ui/react";
import { useTasks } from "../../../contexts/TasksContext";
import DailyTaskComponent from "../DailyTaskComponent";

export default function DailyTasksList() {
  const { categorizedTasksList } = useTasks()

  return (
    <Flex
      direction={'column'}
      width={'100%'}
      rowGap={'24px'}
      padding={'16px'}
    >
      <Flex
        direction={'column'}
        width={'100%'}
        rowGap={'8px'}
      >
        <Heading as='h4' size='md'>
          A fazer
        </Heading>
        {
          categorizedTasksList.pending.map(item => {
            return (
              <DailyTaskComponent key={item?.id} task={item} taskStatus="pending" />
            )
          })
        }
      </Flex>
      <Flex
        direction={'column'}
        width={'100%'}
        rowGap={'8px'}
      >
        <Heading as='h4' size='md'>
          Feitas
        </Heading>
        {
          categorizedTasksList.done.map(item => {
            return (
              <DailyTaskComponent key={item?.id} task={item} taskStatus="done" />
            )
          })
        }
      </Flex>
      <Flex
        direction={'column'}
        width={'100%'}
        rowGap={'8px'}
      >
        <Heading as='h4' size='md'>
          Desabilitadas
        </Heading>
        {
          categorizedTasksList.disabled.map(item => {
            return (
              <DailyTaskComponent key={item?.id} task={item} taskStatus="disabled" />
            )
          })
        }
      </Flex>
    </Flex>
  )
}