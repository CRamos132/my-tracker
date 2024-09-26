import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Mood as MoodInterface } from "../../../contexts/MoodsContext";
import useMood from "../../../hooks/useMood";
import Mood from "../Mood";
import NewMoodFormContent from "../NewMoodFormContent";

interface IMoodComponent {
  mood: MoodInterface
}

export default function MoodComponent({ mood }: IMoodComponent) {
  const {
    checkMutation,
    handleDelete,
    handleSubmit,
    isDeleteOpen,
    isEditOpen,
    onDeleteClose,
    onDeleteOpen,
    setIsEditOpen,
  } = useMood(mood)

  return (
    <>
      <Mood
        mood={mood}
        handleEdit={() => setIsEditOpen(true)}
        handleDelete={onDeleteOpen}
        handleClickCheck={checkMutation}
      />
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Você deseja deletar este mood?</ModalHeader>
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
            <NewMoodFormContent mood={mood} onSubmit={handleSubmit} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}