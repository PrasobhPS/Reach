import React from "react";
// const LazyTemp = React.lazy(
//   () => import("../components/FileUpload/FileUpload")
// );

const Events = React.lazy(() => import("../pages/Events"));
const Clubs = React.lazy(() => import("../pages/Clubs"));
const Profile = React.lazy(() => import("../features/Profile/Profile"));

export const protectedRoutes = [
  // {
  //   path: "/app/*",
  //   element: <LazyTemp />,
  // },

  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/clubs",
    element: <Clubs />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },
];
