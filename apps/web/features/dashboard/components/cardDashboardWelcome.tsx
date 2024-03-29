import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { SafeUser } from "schemas/auth/Auth";

//TODO - CARD WELCOME

//const GREETING = getGreeting();
//const MESSAGE = getRandomMessage(messagesForCurrentSeason);
//const IMAGE = getImageForSeason();

const CardDashboardWelcome = () => {
  const { data: user } = useSession();
  const _user = user?.user as unknown as SafeUser;

  return _user ? <></> : <Spinner />;
};

export default CardDashboardWelcome;
