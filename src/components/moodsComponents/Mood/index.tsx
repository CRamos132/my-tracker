import { Checkbox, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa";
import { Mood as MoodInterface } from "../../../contexts/MoodsContext";

interface IMood {
  mood: MoodInterface
  handleEdit: () => void
  handleDelete: () => void
  handleClickCheck: (isChecked: boolean) => void
}

export default function Mood({ handleClickCheck, handleDelete, handleEdit, mood }: IMood) {
  const handleClick = () => {
    handleClickCheck(Boolean(mood.isChecked))
  }

  return (
    <Flex
      border={`1px solid var(--chakra-colors-blue-600)`}
      borderRadius={'4px'}
      direction={'row'}
      backgroundColor={'blue.200'}
    >
      <Flex
        padding={'8px'}
        backgroundColor={'blue.300'}
        onClick={handleClick}
        alignItems={'flex-start'}
        paddingTop={'16px'}
      >
        <Checkbox
          size={'lg'}
          isChecked={mood.isChecked}
        />
      </Flex>
      <Flex
        fontSize={'24px'}
        padding={'8px 12px'}
        as={Link}
        width={'100%'}
        href={`mood/${mood.id}`}
        direction={'column'}
      >
        {mood.name}
      </Flex>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        marginLeft={'auto'}
      >
        <Menu>
          <MenuButton backgroundColor={'transparent'} as={IconButton} icon={<FaAngleDown />} />
          <MenuList>
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleDelete}>Deletar</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}