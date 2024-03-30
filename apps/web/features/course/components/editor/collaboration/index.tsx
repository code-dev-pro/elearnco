import {
  AwarenessState,
  CollaborationProvider,
  YjsProvider,
  useAwarenessStateField,
  useCollaboration,
} from "collaboration";
import { Cursor } from "./cursor";
import { useUser } from "lib/providers/auth.provider";
import { SafeUser } from "schemas/auth/Auth";
import { PresenceBarTopUI } from "ui";
import { useEffect } from "react";

const CollaborationAvatars = () => {
  const { connect, doc, isLeader, connected, disconnect } = useCollaboration();
  const [usernames] = useAwarenessStateField<AwarenessState["username"]>("username");

  useEffect(() => {
    if (connected) return;
    connect(`Elearnco-course-${"course.id"}`);
  }, [connect, connected]);

  return <PresenceBarTopUI user={usernames} isLeader={isLeader as boolean} />;
};

const Collaboration = (props: React.PropsWithChildren) => {
  const { children } = props;
  const user = useUser() as SafeUser & { color: string };
  const userName = user;
  const userColor = user?.color ?? "#8e84ff";

  return userName ? (
    <YjsProvider>
      <CollaborationProvider
        user={{...user,color:userColor}}
        collaboratorElement={({ mouse }) => (
          <Cursor {...mouse} username={user.name} color={userColor} />
        )}
      >
        {children}
        <CollaborationAvatars />
      </CollaborationProvider>
    </YjsProvider>
  ) : (
    <></>
  );
};

export default Collaboration;
