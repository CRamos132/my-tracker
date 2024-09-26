import { Box, Button, Flex } from "@chakra-ui/react";
import PageWrapper from "../../components/PageWrapper";
import { useState } from "react";
import MoodsList from "../../components/moodsComponents/MoodsList";
import NewMoodForm from "../../components/moodsComponents/NewMoodForm";
import { MoodsProvider } from "../../contexts/MoodsContext";

export default function MoodPage() {
  const [isNewMoodFormOpen, setIsNewMoodForm] = useState(false)

  return (
    <MoodsProvider>
      <PageWrapper>
        <Flex
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          padding={'8px'}
        >
          <Box as='h1' fontSize={'32px'} fontWeight={'700'}>
            Moods
          </Box>
          <Button onClick={() => setIsNewMoodForm(true)}>+</Button>
        </Flex>
        <MoodsList />
        <NewMoodForm isOpen={isNewMoodFormOpen} onClose={() => setIsNewMoodForm(false)} />
      </PageWrapper>
    </MoodsProvider>
  )
}