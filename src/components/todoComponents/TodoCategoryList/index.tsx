import { Flex } from "@chakra-ui/react";
import ToDoCategory from "../ToDoCategory";
import useTodoCategories from "../../../hooks/useTodoCategories";
import LazyLoad from "react-lazy-load";

export default function TodoCategoryList() {
  const { todoCategories } = useTodoCategories()
  console.log("🚀 ~ todoCategories:", todoCategories)
  return (
    <Flex direction={'column'} padding={'16px'} gap={'32px'}>
      {
        todoCategories.map(item => {
          return (
            <LazyLoad key={item.id}>
              <ToDoCategory todoCategory={item} />
            </LazyLoad>
          )
        })
      }
    </Flex>
  )
}