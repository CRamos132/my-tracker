import { Flex } from "@chakra-ui/react";
import ToDoCategory from "../ToDoCategory";
import useTodoCategories from "../../../hooks/useTodoCategories";

export default function TodoCategoryList() {
  const { todoCategories } = useTodoCategories()
  console.log("🚀 ~ todoCategories:", todoCategories)
  return (
    <Flex direction={'column'} padding={'16px'} gap={'32px'}>
      {
        todoCategories.map(item => {
          return (
            <ToDoCategory key={item.id} todoCategory={item} />
          )
        })
      }
    </Flex>
  )
}