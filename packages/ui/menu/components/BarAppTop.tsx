"use client";
import { Link, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { useHotkeys } from "customhooks/use-hotkeys/use-hotkeys";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import React, { Suspense } from "react";
import { ERoutes } from "schemas";
import {
  EActionskeysUser,
  EActionsMenuShortcuts,
  EActionsUser,
} from "schemas/actions/enums";
import { SafeUser } from "schemas/auth/Auth";
import { DATA_MENU_UI, DATA_USER } from "schemas/mocks";
import { LogoSymbolUI } from "ui/logo/LogoSymbolUI";

import { useGlobalModalStore } from "../../../store/modal/useModalStore";
import { CourseTitleUI } from "../../course/CourseTitleUI";
import CourseTitle from "../../course/preview/title";
import { DropdownUI } from "../../dropdown/DropdownUI";
import { UserUI } from "../../user/UserUI";
import UserActivity from "../../userActivity/UserActivity";
import { MenuUI } from "../MenuUI";
import ButtonBack from "./ButtonBack";
import SaveStatusIndicator from "./SaveStatusIndicator";

const BarAppTop = () => {
  const { data: user } = useSession();
  const _user = user?.user as unknown as SafeUser;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") ?? `/${ERoutes.SIGN}`;
  const modalStore = useGlobalModalStore();
  const isEditor = pathname.includes(ERoutes.EDITOR);
  const isPreview = pathname.includes(ERoutes.PREVIEW);

  useHotkeys([
    ["mod+K", (): void => modalStore.onOpen(EActionsMenuShortcuts.TIPS)],
    [
      EActionskeysUser.EDIT_PROFIL,
      (): void => modalStore.onOpen(EActionsUser.EDIT_PROFIL, { data: user }),
    ],
    [
      EActionskeysUser.DELETE,
      (): void => modalStore.onOpen(EActionsUser.DELETE, { data: user }),
    ],
    [
      EActionskeysUser.HELP,
      (): void => modalStore.onOpen(EActionsUser.HELP, { data: null }),
    ],
    [EActionskeysUser.LOGOUT, (): Promise<void> => signoutUser()],
  ]);

  const signoutUser = async (): Promise<void> => {
    await signOut({
      redirect: false,
      callbackUrl,
    });
    router.push(callbackUrl);
  };

  const _actionHandler = async (action: string): Promise<void> => {
    if (
      action === (EActionsUser.DELETE as string) ||
      action === (EActionsUser.EDIT_PROFIL as string) ||
      action === (EActionsUser.SETTINGS as string) ||
      action === (EActionsUser.HELP as string)
    ) {
      modalStore.onOpen(action, { data: user });
    } else if (action === (EActionsUser.LOGOUT as string)) {
      signoutUser();
    }
  };

  return (
    <>
      <NavbarContent justify="start">
        <Link href={`/${ERoutes.HOME}`}>
          <NavbarBrand className="flex items-center">
            <LogoSymbolUI color="white" width={50} height={50} />
          </NavbarBrand>
        </Link>

        <div className="flex justify-start items-center ml-2 relative">
          <UserActivity />
          <ButtonBack />
          {isEditor && (
            <div className="left-4 relative">
              <CourseTitleUI />
            </div>
          )}
        </div>
      </NavbarContent>
      {!isPreview ? (
        <NavbarContent as="div" className="items-center" justify="center">
          <MenuUI
            classnames="z-50"
            fixedInPosition="top"
            data={DATA_MENU_UI}
            position="relative"
          />
          <div className="relative flex items-center ml-2">
            <Suspense>
              <SaveStatusIndicator />
            </Suspense>
          </div>
        </NavbarContent>
      ) : (
        <CourseTitle />
      )}
      <NavbarContent as="div" className="items-center" justify="end">
        <DropdownUI
          actionHandler={_actionHandler}
          data={DATA_USER}
          placement="bottom-end"
        >
          <span role="button" className="flex">
            <UserUI
              name={_user?.name as string}
              description={_user?.role as string}
              image={_user?.image as string}
            />
          </span>
        </DropdownUI>
      </NavbarContent>
    </>
  );
};

export default BarAppTop;
