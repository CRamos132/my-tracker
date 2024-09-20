import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { Task, TaskStatus } from "../../../contexts/TasksContext";
import DailyTask from "../DailyTask";
import DailyTaskFormContent from "../DailyTaskFormContent";
import useDailyTask from "../../../hooks/useDailyTask";

interface IDailyTaskComponent {
  task: Task
  taskStatus: TaskStatus
}

export default function DailyTaskComponent({ task, taskStatus }: IDailyTaskComponent) {
  const {
    handleDelete,
    handleDisable,
    handleSubmit,
    isDeleteOpen,
    isEditOpen,
    onDeleteOpen,
    setIsEditOpen,
    onDeleteClose,
    checkMutation
  } = useDailyTask(task)

  return (
    <>
      <DailyTask
        task={task}
        handleEdit={() => setIsEditOpen(true)}
        handleDisable={handleDisable}
        handleDelete={onDeleteOpen}
        handleClickCheck={checkMutation}
        taskStatus={taskStatus}
      />
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Você deseja deletar esta tarefa?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Esta ação não poderá ser desfeita
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onDeleteClose}>
              Cancelar
            </Button>
            <Button colorScheme='red' onClick={handleDelete}>Deletar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Drawer onClose={() => setIsEditOpen(false)} isOpen={isEditOpen} size={'full'} placement={'bottom'}>
        <DrawerOverlay />
        <DrawerContent borderRadius={'24px 24px 0px 0px'}>
          <DrawerCloseButton />
          <DrawerHeader>
            Editar tarefa
          </DrawerHeader>
          <DrawerBody>
            <DailyTaskFormContent task={task} onSubmit={handleSubmit} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}