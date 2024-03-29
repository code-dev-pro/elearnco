import { useSession } from "next-auth/react";
import { SafeUser } from "schemas/auth/Auth";
import CardProfil from "./cardProfil";

const CardProfilContainer = () => {
  const { data: user } = useSession();
  const _user = user?.user as SafeUser | undefined;

  return <CardProfil dataUser={_user} />;
};

export default CardProfilContainer;
