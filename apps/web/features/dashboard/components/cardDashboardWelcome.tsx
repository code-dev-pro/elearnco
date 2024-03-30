import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { SafeUser } from "schemas/auth/Auth";

const CardDashboardWelcome = () => {
  const { data: user } = useSession();
  const _user = user?.user as unknown as SafeUser;

  return _user ? <></> : <Spinner />;
};

export default CardDashboardWelcome;
