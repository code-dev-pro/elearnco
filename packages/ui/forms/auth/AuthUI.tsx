"use client";
import { Card, CardBody, Spacer, Tab, Tabs } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";
import { UserAuthSigninSchema, UserAuthSignupSchema } from "schemas/forms";
import { LogoSymbolUI } from "ui/logo/LogoSymbolUI";

import { SigninUI } from "./SigninUI";
import { SignupUI } from "./SignupUI";

interface IProps {
  authSignup?: (data: UserAuthSignupSchema) => Promise<void>;
  authSignin?: (data: UserAuthSigninSchema) => Promise<void>;
  authForgetPassword?: () => void;
  className?: string;
}

export const AuthUI = (props: IProps) => {
  
  const { authSignup, authSignin, authForgetPassword, className } = props;
  const [selected, setSelected] = useState<React.Key>("login");
  const t = useTranslations("auth");

  const _selected = (key: React.Key): void => setSelected(key);

  const getSmiley = useCallback(() => {
    if (selected === "login") return <>👋 </>;
    return <>🥳 </>;
  }, [selected]);

  const TITLE = selected === "login" ? t("signin.title") : t("signup.title");

  return (
    <div className={`flex flex-col ${className}`}>
      <Card
        radius="none"
        className="h-full w-full items-center rounded-none sm:rounded-s-3xl"
      >
        <CardBody className="overflow-hidden w-full max-w-2xl">
          <div className="w-full flex justify-center">
            <LogoSymbolUI color="currentColor" width={70} height={70} />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight py-4 text-center">
            {getSmiley()}
            {TITLE}
          </h1>
          <Spacer y={4} />
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected as string}
            onSelectionChange={(key: React.Key): void => _selected(key)}
          >
            <Tab key="login" title="Sign in">
              <Spacer y={4} />
              <SigninUI
                authForgetPassword={authForgetPassword}
                authSignin={authSignin}
                switchVue={_selected}
              />
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <Spacer y={4} />
              <SignupUI authSignup={authSignup} switchVue={_selected} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default AuthUI;
