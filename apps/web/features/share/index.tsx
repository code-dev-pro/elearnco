import { Spinner, Tab, Tabs } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { IconUI } from "ui/icon/IconUI";
import LinksShare from "./linksShare";
import { IDataTag } from "ui/tag/types";

//TODO - TRANSLATIONS

const DynamicShareWithTrainers = dynamic(
  () => import("ui/share/ShareWithTrainerUI"),
  {
    loading: () => <Spinner />,
  }
);

const DynamicShareWithLearner = dynamic(
  () => import("ui/share/ShareWithLearnerUI"),
  {
    loading: () => <Spinner />,
  }
);
const ShareWith = () => {
  const _sahreWithUsers = (data: IDataTag): void => {
    const { all, section } = data;
  };

  return (
    <div className="flex w-full flex-col">
      <Tabs
        classNames={{ base: "max-w-2xl px-1", tabList: "w-full" }}
        aria-label="Options"
        color="primary"
        variant="bordered"
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <IconUI width={22} height={22} name="trainer" />
              <span>With my colleagues</span>
            </div>
          }
        >
          <div className="max-w-xl">
            <LinksShare />
            <p className="text-xs mb-2 mt-2">Invite collaborators :</p>
            <DynamicShareWithTrainers
              callback={(data) => _sahreWithUsers(data)}
              forUserEmail
            />
          </div>
        </Tab>
        <Tab
          key="music"
          isDisabled
          title={
            <div className="flex items-center space-x-2">
              <IconUI width={22} height={22} name="learner" />
              <span>With my learners</span>
            </div>
          }
        >
          <DynamicShareWithLearner />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ShareWith;
