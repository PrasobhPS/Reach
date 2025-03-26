import React from "react";
// const LazyTemp = React.lazy(
//   () => import("../components/FileUpload/FileUpload")
// );
const ClubHouse = React.lazy(() => import("../pages/ClubHouse"));
const Chandlery = React.lazy(() => import("../pages/Chandlery"));
const CrewFinder = React.lazy(() => import("../pages/CrewFinder"));
const NoticeBoard = React.lazy(() => import("../pages/NoticeBoard"));
const Insurance = React.lazy(() => import("../pages/Insurance"));
// const ChatDesignPage = React.lazy(() => import("../pages/ChatDesignPage"));
const CruzRoutes = React.lazy(() => import("../features/Cruz/routes"));
const GroupChat = React.lazy(() => import("../features/Chat/GroupChat/GroupChat"));
const PublicProfile = React.lazy(() => import("../components/PublicProfile/PublicProfile"));
const VideoCall = React.lazy(() => import("../features/VideoCall/VideoCall"));

export const memberRoutes = [
  // {
  //   path: "/app/*",
  //   element: <LazyTemp />,
  // },
  {
    path: "/chandlery",
    element: <Chandlery />,
  },
  {
    path: "/publicprofile",
    element: <PublicProfile />,
  },
  {
    path: "/publicprofile/:encodedId",
    element: <PublicProfile />,
  },
  {
    path: "/cruz/*",
    element: <CruzRoutes />,
  },
  {
    path: "/club-house",
    element: <ClubHouse />,
  },
  {
    path: "/crew-finder",
    element: <CrewFinder />,
  },
  {
    path: "/notice-board",
    element: <NoticeBoard />,
  },
  {
    path: "/insurance",
    element: <Insurance />,
  },
  {
    path: "/group-chat/:roomId",
    element: <GroupChat />,
  },
  {
    path: "/video-call",
    element: <VideoCall />,
  },
];
