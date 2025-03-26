import React from "react";
import { lazyImport } from "../utils/lazyImport";
import SpecialistsDetails from "../pages/Specialists-details";
import Privacy from "../pages/Privacy";
import path from "path";
import PayementPage from "../components/PaymentModalPage/PayementPage";
// import Home from "../pages/Home";
const Charter = React.lazy(() => import("../pages/Charter"));
const Home = React.lazy(() => import("../pages/Home"));
const DiscoverReach = React.lazy(() => import("../pages/DiscoverReach"));
const Membership = React.lazy(() => import("../pages/Membership"));
const JoinMembership = React.lazy(() => import("../features/MemberSignup/JoinMembership"));
const FreeMembership = React.lazy(() => import("../features/MemberSignup/FreeMembership"));
const Specialists = React.lazy(() => import("../pages/Specialists"));
const Contact = React.lazy(() => import("../pages/Contact"));
const Legal = React.lazy(() => import("../pages/Legal"));
const MemberSignup = React.lazy(
  () => import("../features/MemberSignup/MemberSignup")
);
const PasswordReset = React.lazy(() => import("../pages/PasswordReset"));
const Weather = React.lazy(() => import("../pages/Weather"));
const Partners = React.lazy(() => import("../pages/Partners"));
const ConnectStripe = React.lazy(() => import("../pages/ConnectStripe"));
const Terms = React.lazy(() => import("../components/legal/Terms"));
const PrivacyPage = React.lazy(() => import("../components/legal/Privacy"));
const PaymentStatus = React.lazy(() => import("../pages/PaymentStatus"));
const VerificationSend = React.lazy(() => import("../features/MemberSignup/EmailVerificationSend"));
const EmailVerified = React.lazy(() => import("../features/MemberSignup/EmailVerified"));
export const publicRoutes = [

  {
    path: "/",
    element: <Home />,
  },
  {
    path: 'charter',
    element: <Charter />
  },
  {
    path: "/freemembership",
    element: <FreeMembership />
  },
  {
    path: "/joinmembership",
    element: <JoinMembership />
  },
  {
    path: "/joinmembership/:referral_code",
    element: <JoinMembership />
  },
  {
    path: "/discover-reach",
    element: <Membership />,
  },
  {
    path: "/membership",
    element: <Membership />,
  },
  {
    path: "/experts",
    element: <Specialists />,
  },
  {
    path: "/specialists-details",
    element: <SpecialistsDetails />
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/legal",
    element: <Legal />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/member-signup",
    element: <MemberSignup />,
  },
  {
    path: "/member-signup/:ios_token",
    element: <MemberSignup />,
  },
  {
    path: "/reset-password/",
    element: <PasswordReset />,
  },
  {
    path: "/weather",
    element: <Weather />,
  },
  {
    path: "/partners",
    element: <Partners />,
  },
  {
    path: "/connect-stripe",
    element: <ConnectStripe />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/privacypage",
    element: <PrivacyPage />,
  },
  {
    path: "/booking/success",
    element: <PaymentStatus />
  },
  {
    path: "/booking/unsuccessful",
    element: <PaymentStatus />
  },
  {
    path: "paymentpage",
    element: <PayementPage />
  },
  {
    path: "emailVerificationSend",
    element: <VerificationSend />
  },
  {
    path: "/verify-email/",
    element: <EmailVerified />
  }

];
