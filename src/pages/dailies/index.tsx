import PageWrapper from "../../components/PageWrapper";
import { useAuth } from "../../contexts/AuthContext";

export default function DailiesPage() {
  const { user } = useAuth()

  return (
    <PageWrapper>
      Vem aí viu {user?.displayName}
    </PageWrapper>
  )
}