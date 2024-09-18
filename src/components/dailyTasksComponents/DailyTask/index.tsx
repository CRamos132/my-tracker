import { Checkbox, Flex } from "@chakra-ui/react";
import { Task } from "../../../contexts/TasksContext";

interface IDailyTask {
  task: Task
}

export default function DailyTask({ task }: IDailyTask) {
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
        {task.name}
      </Flex>
    </Flex>
  )
}