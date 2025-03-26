import React from "react";
import { Hero } from "../components/Hero/Hero";
import { CmsHeader } from "../components/CmsHeader/CmsHeader";
import "../assets/scss/terms&condition.scss";
function Legal() {
  return (
    <div className="App">
      <div className="terms-and-condition">
        <CmsHeader links={[]}></CmsHeader>
      </div>
    </div>
  );
}
export default Legal;
