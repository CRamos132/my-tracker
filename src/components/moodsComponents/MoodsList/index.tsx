import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import MoodComponent from "../MoodComponent";
import { useMoods } from "../../../contexts/MoodsContext";
import { IoSearchOutline } from "react-icons/io5";
import { useMemo, useState } from "react";

export default function MoodsList() {
  const [searchText, setSearchText] = useState('')

  const { moodsList } = useMoods()

  const handleChange = (event) => setSearchText(event.target.value)

  const filteredSearchText = useMemo(() => {
    if (!searchText.length) {
      return moodsList
    }
    return [...moodsList].filter(item => {
      return item.name.toLowerCase().includes(searchText.toLowerCase())
    })
  }, [moodsList, searchText])

  return (
    <Flex
      direction={'column'}
      width={'100%'}
      rowGap={'24px'}
      padding={'16px'}
    >
      <InputGroup>
        <InputLeftElement pointerEvents='none'>
          <IoSearchOutline color='gray.300' />
        </InputLeftElement>
        <Input placeholder="Busque moods" onChange={handleChange} />
      </InputGroup>
      {
        filteredSearchText.map(item => {
          return (
            <MoodComponent mood={item} key={item.id} />
          )
        })
      }
    </Flex>
  )
}