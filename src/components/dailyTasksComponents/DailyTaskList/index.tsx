import { Flex } from "@chakra-ui/react";
import { useTasks } from "../../../contexts/TasksContext";
import DailyTaskComponent from "../DailyTaskComponent";

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
            <DailyTaskComponent key={item?.id} task={item} />
          )
        })
      }
    </Flex>
  )
}