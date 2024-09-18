import PageWrapper from "../../components/PageWrapper";
import { useAuth } from "../../contexts/AuthContext";

export default function TodoPage() {
  const { user } = useAuth()

  return (
    <PageWrapper>
      Vem aí viu {user?.displayName}
    </PageWrapper>
  )
}