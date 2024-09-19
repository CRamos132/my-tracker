import { Checkbox, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Task } from "../../../contexts/TasksContext";
import { FaAngleDown } from "react-icons/fa";

interface IDailyTask {
  task: Task
  handleEdit: () => void
  handleDisable: () => void
  handleDelete: () => void
}

export default function DailyTask({ task, handleEdit, handleDisable, handleDelete }: IDailyTask) {
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
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        marginLeft={'auto'}
      >
        <Menu>
          <MenuButton as={IconButton} icon={<FaAngleDown />} />
          <MenuList>
            <MenuItem onClick={handleEdit}>Editar</MenuItem>
            <MenuItem onClick={handleDisable}>
              {
                task?.isDisabled
                  ? 'Habilitar'
                  : 'Desabilitar'
              }
            </MenuItem>
            <MenuItem onClick={handleDelete}>Deletar</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}