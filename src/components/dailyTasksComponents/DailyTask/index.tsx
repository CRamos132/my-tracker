import { Checkbox, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Task, TaskStatus } from "../../../contexts/TasksContext";
import { FaAngleDown } from "react-icons/fa";
import Link from "next/link";

interface IDailyTask {
  task: Task
  handleEdit: () => void
  handleDisable: () => void
  handleDelete: () => void
  taskStatus: TaskStatus
  handleClickCheck: () => void
}

export default function DailyTask({ task, handleEdit, handleDisable, handleDelete, taskStatus, handleClickCheck }: IDailyTask) {
  const taskColors = {
    disabled: {
      background: 'gray.200',
      checkbox: 'gray.300',
      border: 'black'
    },
    pending: {
      background: 'blue.200',
      checkbox: 'blue.300',
      border: 'var(--chakra-colors-blue-600)'
    },
    done: {
      background: 'green.200',
      checkbox: 'green.300',
      border: 'var(--chakra-colors-green-600)'
    },
  }
  return (
    <Flex
      border={`1px solid ${taskColors[taskStatus]?.border}`}
      direction={'row'}
      backgroundColor={taskColors[taskStatus]?.background}
    >
      <Flex
        padding={'8px'}
        backgroundColor={taskColors[taskStatus]?.checkbox}
        onClick={handleClickCheck}
      >
        <Checkbox
          size={'lg'}
        />
      </Flex>
      <Flex
        fontSize={'24px'}
        padding={'8px 12px'}
        as={Link}
        width={'100%'}
        href={`task/${task.id}`}
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