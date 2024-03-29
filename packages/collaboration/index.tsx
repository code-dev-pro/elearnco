"use client";

//import { useUser } from "lib/providers/auth.provider";

export * from "./yjs.provider";
export * from "./collaboration.provider";
export * from "./types";
export * from "./hooks";

/**
 * We nedd to
 *
 */

// const FeatureCollaboration = () => {

//   const user = useUser();//We need to be auth for access to the user
//   const {name} = user;
//   //

//   return <>{username}</>;
// };
// export default FeatureCollaboration;

//NOTE - Collaboration is a great feature :-)
/*  import {
  AwarenessState,
  CollaborationProvider,
  useAwarenessStateField,
  useCollaboration,
  useYMapItem,
  YjsProvider,
} from "collaboration";
import { random } from "lodash";
import {  useMemo } from "react";
import { PresenceBarTopUI } from "ui";
import FeatureCourseEditor from "../course";
import { changeCursor } from "lib";
 */
/* const FeatureCollaboration = () => {
  const username = useMemo(() => `User ${random(10000, 99999)}`, []);

  return  <YjsProvider>
      <CollaborationProvider
        username={username}
        collaboratorElement={({ mouse }) => <Cursor {...mouse} />}
      >
        <Editor />
      </CollaborationProvider>
    </YjsProvider> 
  
}; */
/* const couleurAleatoire = () => {
  const couleur = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + "0".repeat(6 - couleur.length) + couleur;
}; */
/* const Cursor = (props) => {
  const { x, y, username } = props;
  const color = useMemo(() => couleurAleatoire(), [username]);

  changeCursor("none");

  return (
    <div
      style={{
        position: "fixed",
        top: `${y}px`,
        left: `${x}px`,
        zIndex: 999999,
      }}
    >
      <svg width="32" height="44" viewBox="0 0 24 36" fill="none">
        <path
          fill={color}
          d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
        />
      </svg>
      <span
        style={{
          top: 0,
          left: 0,
          height: "2rem",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          backgroundColor: color,
          marginLeft: "1rem",
          marginTop: "-2rem",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
          color: "black",
        }}
        className="flex items-center relative rounded-full"
      >
        Laurent{" "}
      </span>
    </div>
  );
}; */
/* const Editor = () => {
  const { connect, doc, isLeader, connected, disconnect } = useCollaboration();
  const [name, setName] = useYMapItem<string>(doc.getMap("page"), "name");
  const [usernames] = useAwarenessStateField<AwarenessState["username"]>("username");
  const [mouses, mouse, setMouse] =useAwarenessStateField<AwarenessState['bloc']>('bloc');
  const [block, setBlock] = useYMapItem<any[]>(doc.getMap("page"), "bloc");

  useEffect(() => {
    if (connected) return;
    connect(`Elearnco-course-${"course.id"}`);
  }, [connect, connected, name]); 
  
  
  return (
    <div>
       <button
        onClick={disconnect}
        style={{ position: "absolute", left: 0, top: 0, zIndex: 99 }}
      >
        Disconnect
      </button>
      <PresenceBarTopUI users={usernames} />
    
      <FeatureCourseEditor />

       Leader: {isLeader ? "Yes" : "No"}
      <br />
      
    </div>
  );
}; */
