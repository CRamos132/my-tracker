import { Flex } from "@chakra-ui/react"
import { Entities } from "../../types/entities"
import { Link } from "@chakra-ui/next-js"

interface ISimpleEntity {
  name: string
  entityType: Entities
  entityId: string
}

export default function SimpleEntity({ entityId, entityType, name }: ISimpleEntity) {
  const entityKeyByType: Record<Entities, string> = {
    moods: 'mood',
    tasks: 'task'
  }

  return (
    <Flex
      border={`1px solid var(--chakra-colors-blue-600)`}
      borderRadius={'4px'}
      direction={'row'}
      backgroundColor={'blue.200'}
    >
      <Flex
        fontSize={'24px'}
        padding={'8px 12px'}
        as={Link}
        width={'100%'}
        href={`/${entityKeyByType[entityType]}/${entityId}`}
        direction={'column'}
      >
        {name}
      </Flex>
    </Flex>
  )
}