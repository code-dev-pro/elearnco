import { LayoutEditorUI } from "ui";
import { CourseQueryGeneric } from "../query/courseQueryGeneric";
import { WIDTH_SIDEBAR } from "@/const";
import React, { useMemo, useState } from "react";
import { useCoursesParams, useIsCollaboration } from "customhooks";
import { appendUnit } from "lib/utils";

import { useUser } from "lib/providers/auth.provider";
import { SafeUser } from "schemas/auth/Auth";

const CourseQuery = React.memo(() => {
  const isCollaboration = useIsCollaboration("/collaboration");
  return (
    <>
      {isCollaboration ? (
        <></>
      ) : (
        <CourseQueryGeneric>
          <LayoutEditorUI />
        </CourseQueryGeneric>
      )}
    </>
  );
});
CourseQuery.displayName = "CourseQuery";

// Par défaut le user est en mode non collaboration mais peut il peut switcher
// Lors des invitations les users ont un statut writer or reader or isLeader
// Le user a un avatar aléatoire
// En bdd lorsque l'on lance un partage avec d'autres users on met un id de room (id du cours, code unique user)
// Si je ne suis pas le leader et pas authentifié : user restera undefined

const CourseAccess = () => {
  const isCollaboration = useIsCollaboration("collaboration");
  const { getCurrentPage, getCurrentUserCollaboration } = useCoursesParams();
  const page = getCurrentPage();
  const collaborator = getCurrentUserCollaboration();
  const user = useUser();

  // const openModal = useCallback(
  //   () => modalStore.onOpen(EActionsMenuShortcuts.FEATURES),
  //   []
  // );
 
  // Il vaut mieux redigérer vers une page de connexion avec le code
  // le user saisie le code => on récupère donc l'adresse email + avatar
  // on le redirige vers la page collaboration avec la room
  //if (user==undefined) { openModal()}

 

  return (
    <>
      {/* <CourseCore
        user={{ ...user, name: collaborator }}
        color={
          (collaborator === "laurent" || user.username === "heneman laurent") &&
          collaborator !== "lucile"
            ? "magenta"
            : "green"
        }
      />
      : <></>
      <Inspector
        expandPaths={["$", "$.user.author.0", "$.*"]}
        isTable
        data={{
          user,
          page,
          isCollaboration: isCollaboration,
          collaborator: collaborator,
        }}
      /> */}
    </>
  );
};

const CourseCore = (props: SafeUser & { color: string }) => {
  const isCollaboration = useIsCollaboration("collaboration");
  const user = props;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const _callback = (state: boolean): void => {
    setIsOpen(state);
  };

  const userParams = useMemo(() => {
    return {
      username: user?.name?.split(" ")[1] ?? "",
      color: props.color,
    };
  }, []);
  // const userParamsUpdate = useMemo(() => {
  //  return {...userParams,
  //   username: user?.name?.split(" ")[1] ?? ""}
  // }, [user]);

  // const username = user?.name?.split(" ")[1] ?? "";
  //useMemo(() => `User ${getRandomNumber(10000, 99999)}`, []);
  //const username = `User ${getRandomNumber(10000, 99999)}`;
  const WIDTH = isOpen ? `${appendUnit(WIDTH_SIDEBAR)}` : "0";
  return <></>;
  // isCollaboration ? (
    // <YjsProvider>
    //   <CollaborationProvider
    //     username={user} //userParams.username}
    //     collaboratorElement={({ mouse, username }) => (
    //       <Cursor {...mouse} username={username} color={userParams.color} />
    //     )}
    //   >
    //     <GraphProvider>
    //       <EditorThinking />
    //     </GraphProvider>
    //   </CollaborationProvider>
    // </YjsProvider>
  // ) : (
  //   <GraphProvider>
  //     <EditorThinking />
  //   </GraphProvider>
  // );
};

//export default CourseAccess;
