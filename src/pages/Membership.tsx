import React, { useEffect, useState } from "react";
import { Hero } from "../components/Hero/Hero";
import { TwoColumnImageBox } from "../components/TwoColumnImageBox/TwoColumnImageBox";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import { FeaturesCard } from "../components/FeaturesCard/FeaturesCard";
import "../assets/scss/membership.scss";
import {
  weather,
  events,
  clubs,
  partners,
  chandler,
  clubHouse,
  crewFinder,
  noticeBoard,
  insurance,
} from "../components/FeaturesCard/FeatureOptions";
import { getUserData } from "../utils/Utils";
import { MODAL_TYPES, useGlobalModalContext } from "../utils/GlobalModal";
import { useNavigate } from "react-router-dom";
import { CompareMembership } from "../features/MemberSignup/CompareMembership";
import { CmsHeader } from "../components/CmsHeader/CmsHeader";
function Membership() {
  const navigate = useNavigate();
  const userData = getUserData("userData");
  let memberType = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const { showModal } = useGlobalModalContext();
  const authModal = () => {
    showModal(MODAL_TYPES.AUTH_MODAL, {
      title: "Create instance form",
      confirmBtn: "Save",
    });
  };
  return (
    <div className="App membership-page">

      <CmsHeader links={[]}></CmsHeader>
      <CompareMembership />
    </div>
  );
}

export default Membership;
