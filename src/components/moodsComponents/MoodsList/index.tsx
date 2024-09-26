import { Flex } from "@chakra-ui/react";
import MoodComponent from "../MoodComponent";
import { useMoods } from "../../../contexts/MoodsContext";

export default function MoodsList() {
  const { moodsList } = useMoods()
  console.log("🚀 ~ moodsList:", moodsList)
  return (
    <Flex
      direction={'column'}
      width={'100%'}
      rowGap={'24px'}
      padding={'16px'}
    >
      {
        moodsList.map(item => {
          return (
            <MoodComponent mood={item} key={item.id} />
          )
        })
      }
    </Flex>
  )
}