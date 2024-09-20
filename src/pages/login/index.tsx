import { Box, Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()

  const handleForm = (e) => {
    e?.preventDefault()
    const formData = new FormData(e.target)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = Object.fromEntries(formData)
  }

  return (
    <Box padding={'32px'} backgroundColor={'gray.100'} height={'100vh'}>
      <Flex
        direction={'column'}
        rowGap={'24px'}
        backgroundColor={'gray.200'}
        padding={'32px'}
        borderRadius={'8px'}
        as='form'
        onSubmit={handleForm}
      >
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input name="email" type='email' backgroundColor={'white'} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input name="password" type='password' backgroundColor={'white'} />
        </FormControl>
        <Flex
          direction={'column'}
          rowGap={'16px'}
        >
          <Button colorScheme='blue' type="button" onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
          <Button colorScheme='blue' type="submit">
            Sign in
          </Button>
          <Button colorScheme='blue' type='button'>
            Sign up
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}