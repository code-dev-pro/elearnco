"use client";
import { Spinner } from "@nextui-org/react";
import React from "react";

export const LoadingSpinnerUI = ({ isIndiv }: { isIndiv?: boolean }) => {
  return (
    <div
      className={`flex ${
        isIndiv ? "w-full h-full" : "w-screen h-screen"
      } min-h-full justify-center items-center`}
    >
      <Spinner />
    </div>
  );
};
