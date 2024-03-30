"use client";
import { Navbar } from "@nextui-org/react";
import React from "react";

import { LAYOUT } from "../const";

export const NavBarTopUI = (props: React.PropsWithChildren) => {
  return (
 
      <Navbar className="bg-default-50 fixed" height={LAYOUT.HEADER.height} maxWidth="full">
        {props.children}
      </Navbar>
   
  );
};
