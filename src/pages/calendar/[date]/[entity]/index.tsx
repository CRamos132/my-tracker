import { useRouter } from "next/router";
import PageWrapper from "../../../../components/PageWrapper";
import { Entities } from "../../../../types/entities";
import useGetEntityByDay from "../../../../hooks/useGetEntityByDay";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import { RiArrowLeftSLine } from "react-icons/ri";
import dayjs from "dayjs";
import SimpleEntity from "../../../../components/SimpleEntity";

export default function CalendarDatePage() {
  const router = useRouter()

  const entity = router.query.entity as Entities
  const date = router.query.date as string

  const { entities } = useGetEntityByDay({ date, entity })

  const goBack = () => {
    router.back()
  }

  return (
    <PageWrapper>
      <Flex
        margin={'16px 16px 0px 16px'}
        padding={'16px'}
        borderRadius={'4px'}
        bg='gray.100'
        border={'1px solid var(--chakra-colors-gray-500)'}
        alignItems={'center'}
        gap={'8px'}
      >
        <IconButton
          aria-label="Back
        button"
          icon={<RiArrowLeftSLine />}
          borderRadius={'99px'}
          colorScheme='blue'
          variant='outline'
          onClick={goBack}
        />
        <Text
          as='h1'
          fontWeight={'700'}
          fontSize={'24px'}
        >
          {`My ${entity} in ${dayjs(Number(date) * 1000).format('DD/MM/YYYY')}`}
        </Text>
      </Flex>
      <Flex
        direction={'column'}
        width={'100%'}
        rowGap={'24px'}
        padding={'16px'}
      >
        {entities.map(item => {
          return <SimpleEntity entityId={item.id} entityType={entity} name={item.name} key={item.id} />
        })}
      </Flex>
    </PageWrapper>
  )
}