import { UseInactivityTimer } from "customhooks";
import React, { useEffect } from "react";
import { useActivityStore } from "store";

import { STORAGE_NAME_MAGIC_KEY } from "../const";

const UserActivity = () => {
  const { isActivity } = useActivityStore();
  const { idle, setStartMonitoring } = UseInactivityTimer(1000 * 60 * 10);

  useEffect(() => {
    if (isActivity) setStartMonitoring(isActivity);
  }, [isActivity]);

  useEffect(() => {
    if (idle) {
      const key = STORAGE_NAME_MAGIC_KEY;
      try {
        const item = window.localStorage.getItem(key);
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error reading localStorage key :${key}`, error);
      }
    }
  }, [idle]);

  return <p className="hidden">Status: {idle ? "Inactive" : "Active"}</p>;
};

export default UserActivity;
