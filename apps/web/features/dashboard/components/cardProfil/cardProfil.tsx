import { Button, Spinner, Image } from "@nextui-org/react";
import { useCallback } from "react";
import { EActionsUser } from "schemas/actions/enums";
import { SafeUser } from "schemas/auth/Auth";
import { useGlobalModalStore } from "store/modal";
import { CardDashboardUI } from "ui/card/CardDashboardUI";
import { LoadingSpinnerUI } from "ui/loading";

//TODO: Translation

const HeaderChildren = (user) => {
  const modalStore = useGlobalModalStore();
  const { image } = user;

  const openModal = useCallback(
    () => modalStore.onOpen(EActionsUser.EDIT_PROFIL as string, { data: user }),
    []
  );

  return (
    <div className="flex justify-between w-full">
      <div className="bg-black rounded-full w-14 h-14 flex justify-center items-center">
        <Image
          removeWrapper
          alt=""
          className="object-cover rounded-xl"
          src={`/avatars/${image as string}.svg`}
          width="100%"
        />
      </div>
      <Button color="primary" radius="full" size="sm" onPress={openModal}>
        See my profile
      </Button>
    </div>
  );
};
const BodyChildren = (user) => {
  const { name, role = "LEARNER" } = user;

  return (
    <div className="flex flex-col mt-2">
      <p className="text-md">Hi {name}</p>
      <p className="text-small text-default-500 line-clamp-2">
        We are happy to see you again.
        <br />
        We invite you to discover the last news.
      </p>
    </div>
  );
};
const CardProfil = (props: { dataUser: SafeUser | undefined }) => {
  const { dataUser } = props;
  return (
    <CardDashboardUI
      headerChildren={dataUser ? <HeaderChildren {...dataUser} /> : <></>}
      bodyChildren={
        dataUser ? <BodyChildren {...dataUser} /> : <LoadingSpinnerUI isIndiv />
      }
    />
  );
};

export default CardProfil;
