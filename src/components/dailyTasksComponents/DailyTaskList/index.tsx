import { Flex } from "@chakra-ui/react";
import DailyTask from "../DailyTask";
import { useTasks } from "../../../contexts/TasksContext";

export default function DailyTasksList() {
  const { taskList } = useTasks()
  return (
    <Flex
      direction={'column'}
      width={'100%'}
      rowGap={'8px'}
    >
      {
        taskList.map(item => {
          return (
            <DailyTask key={item?.id} task={item} />
          )
        })
      }
    </Flex>
  )
}