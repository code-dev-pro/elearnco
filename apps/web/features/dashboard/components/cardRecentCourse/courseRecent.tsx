import { Image, Button } from "@nextui-org/react";
import React, { ReactElement } from "react";
import { CardDashboardUI } from "ui/card/CardDashboardUI";
import { useRouter } from "next/navigation";
import { CompleteCourse, ERoutes } from "schemas";
import { checkHttps } from "lib/utils";
import { LoadingSpinnerUI } from "ui";

const HeaderChildren = (props) => {
  const router = useRouter();

  const _goto = () => router.push(`/${ERoutes.EDITOR}/${props.id}?page=1`);

  return (
    <div className="relative flex justify-between w-full overflow-hidden h-[76px]">
      <div className="absolute z-50 right-0">
        <Button color="primary" radius="full" size="sm" onPress={_goto}>
          Open
        </Button>
      </div>
      {props.image ? (
        <Image
          removeWrapper
          alt=""
          className="object-cover rounded-xl"
          src={props.image?.split("?")?.[0]}
          width="100%"
        />
      ) : (
        <></>
      )}
    </div>
  );
};

const BodyChildren = (props) => {
  const { title, description = "" } = props;
  return (
    <div className="flex flex-col mt-2">
      <p className="text-md">{title}</p>
      <p className="text-small text-default-500 line-clamp-2">{description}</p>
    </div>
  );
};
const CourseRecent = ({
  courses,
  onLoading,
  onError,
}: {
  courses: CompleteCourse[];
  onLoading: boolean;
  onError: string | null;
}) => {
  let headerContent: ReactElement | null = null;
  let bodyContent: ReactElement | null = null;

  const rest = {
    id: courses?.[0]?.id,
    title: courses?.[0]?.title,
    description: courses?.[0]?.description,
    image: courses?.[0]?.image
      ? checkHttps(courses?.[0]?.image)
        ? courses?.[0]?.image
        : `/patterns/${courses?.[0]?.image as string}.svg`
      : null,
  };

  if (onLoading) {
    bodyContent = <LoadingSpinnerUI isIndiv />;
  } else if (onError) {
    bodyContent = <p style={{ color: "red" }}>{onError}</p>;
  } else {
    headerContent = <HeaderChildren {...rest} />;
    bodyContent = <BodyChildren {...rest} />;
  }

  return (
    <CardDashboardUI
      headerChildren={headerContent as JSX.Element}
      bodyChildren={bodyContent as JSX.Element}
    />
  );
};

export default CourseRecent;
