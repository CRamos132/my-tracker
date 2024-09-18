import { Flex } from "@chakra-ui/react";
import DailyTask from "../DailyTask";

export default function DailyTasksList() {
  return (
    <Flex
      direction={'column'}
      width={'100%'}
      rowGap={'8px'}
    >
      <DailyTask />
      <DailyTask />
      <DailyTask />
    </Flex>
  )
}