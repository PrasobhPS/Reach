import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { GlobalModal } from "./utils/GlobalModal";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ReactCookieBot from "react-cookiebot";

const domainGroupId = "934ab3d9-d90e-4b0f-bb5e-5228fc7f4501";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalModal>
        <ReactCookieBot domainGroupId={domainGroupId} />
        <AppRoutes />
      </GlobalModal>
    </BrowserRouter>
  );
}

export default App;
