"use client";
import { Avatar } from "@nextui-org/react";
import React from "react";
import { SafeUser } from "schemas/auth/Auth";

export const PresenceBarTopUI = ({
  user,
  isLeader,
}: {
  user: { [key: number]: (SafeUser & { color: string }) | undefined };
  isLeader: boolean;
}) => {
  return user ? (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-50">
      {Object.entries(user)?.map(([clientId, user]) => {
        return (
          <Avatar
            key={clientId}
            className="bg-default mb-2"
            size="md"
            name={user?.name ? user.name : "username"}
            src={user?.image ? `/avatars/${user.image}.svg` : ""}
            style={{ border: `2px solid ${user?.color}`, padding: 4 }}
          />
        );
      })}
    </div>
  ) : (
    <></>
  );
};
