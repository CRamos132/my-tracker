import { Link } from "@chakra-ui/next-js"

interface IMenuLink {
  href: string
  children: React.ReactNode
}

export default function MenuLink({ href, children }: IMenuLink) {
  return (
    <Link
      href={href}
      color='blue.400'
      padding={'32px'}
      fontSize={'24px'}
      fontWeight={'700'}
    >
      {children}
    </Link>
  )
}