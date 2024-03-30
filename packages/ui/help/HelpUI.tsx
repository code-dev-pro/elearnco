"use client";
import {
  Card,
  CardBody,
  Listbox,
  ListboxItem,
  ListboxSection,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { createCollectionFromEnums } from "lib";
import React from "react";
import {
  EActionsCourse,
  EActionskeysCourse,
  EActionskeysUser,
  EActionsUser,
} from "schemas";

import HotkeysUI from "../hotkeys/HotkeysUI";
export const HelpUI = () => {
  const ACTIONS_IN_COURSE = createCollectionFromEnums(
    EActionsCourse,
    EActionskeysCourse
  );
  const ACTIONS_IN_USER = createCollectionFromEnums(
    EActionsUser,
    EActionskeysUser
  );

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        <Tab key="hotkeys" title="Hotkeys">
          <div className="w-full border-small  rounded-small border-default-200 dark:border-default-100">
            <Listbox variant="flat" aria-label="Listbox menu with sections">
              <ListboxSection title="Courses Actions" showDivider>
                {ACTIONS_IN_COURSE.map((action) => (
                  <ListboxItem
                    className={
                      action.action.toLowerCase().includes("delete")
                        ? "text-danger"
                        : ""
                    }
                    endContent={<HotkeysUI collectionKeys={action.key} />}
                    key={action.key}
                    description=""
                  >
                    <p>{action.action} course</p>
                  </ListboxItem>
                ))}
              </ListboxSection>
              <ListboxSection title="User actions">
                {ACTIONS_IN_USER.map((action) => (
                  <ListboxItem
                    className={
                      action.action.toLowerCase().includes("delete")
                        ? "text-danger"
                        : ""
                    }
                    endContent={<HotkeysUI collectionKeys={action.key} />}
                    key={action.key}
                    description=""
                  >
                    <p>{action.action} user</p>
                  </ListboxItem>
                ))}
              </ListboxSection>
            </Listbox>
          </div>
        </Tab>
        <Tab key="tutorials" title="Tutorials">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};
export default HelpUI;
