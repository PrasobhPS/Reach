import React, { useState, useEffect } from "react";
import Logo from "../Logo/Logo";
import "./Footer.scss";
import ListAccordion from "../ListAccordion/ListAccordion";
import { Button } from "../Button/Button";
import CustomInput from "../CustomInput/CustomInput";
import { FormProvider, useForm } from "react-hook-form";
import { useSubscribeNewsletterMutation } from "../../features/Login/authApiSlice";
import { getUserData } from "../../utils/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
interface formValues {
  email: string;
}

function Footer() {
  const form = useForm<formValues>();
  const { register, control, handleSubmit, formState, reset } = form;
  const { errors } = formState;
  const [subscribeNewsletter] = useSubscribeNewsletterMutation();
  const [message, setMessage] = useState('');

  const userDataValue = getUserData("userData");
  let memberType = "";
  try {
    if (userDataValue !== null) {
      memberType = userDataValue.Member_type;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  let urlRedirect = '/joinmembership';
  if (memberType === 'M') {
    urlRedirect = '/';
  } else if (memberType === 'F') {
    urlRedirect = '/member-signup';
  }

  const onSubmit = async (data: formValues) => {
    try {
      let userData = await subscribeNewsletter(data);

      if ('data' in userData) {
        setMessage(userData.data?.message || 'Subscription successful');
      }

      reset();
    } catch (error) {
      setMessage('An unexpected error occurred. Please try again.');
      console.error("Error during subscription:", error);
    }
  };
  useEffect(() => {
    setMessage('');
  }, [])
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const footerMenuOne = [
    {
      text: "Discover REACH",
      target: "/discover-reach",
    },
    // {
    //   text: "Membership",
    //   target: urlRedirect,
    // },
    {
      text: "Get in touch",
      target: "/contact",
    },
  ];
  const footerMenuTwo = [
    {
      text: "Weather",
      target: "/weather",
    },
    {
      text: "Events",
      target: "/",
    },
    {
      text: "Clubhouse",
      target: "/club-house",
    },
    {
      text: "Partners",
      target: "/partners",
    },
  ];

  const footerMenuThree = [
    {
      text: "Chandlery",
      target: "/chandlery",
    },
    {
      text: "Notice Board",
      target: "/",
    },
    {
      text: "Cruz",
      target: "/cruz",
    },
    {
      text: "Chat Room",
      target: "/club-house",
    },
  ];

  const footerMenuFour = [
    {
      text: "Privacy Policy",
      target: "/privacy",
    },
    {
      text: "Terms & Conditions",
      target: "/legal",
    },
    // {
    //   text: "Press",
    //   target: "/dash",
    // },
    // {
    //   text: "Cookie Notice",
    //   target: "/dash",
    // },
  ];
  const footerMenuFIve = [
    {
      icon: faXTwitter,

      target: "https://x.com/ReachBoats",
    },
    {
      target: "https://www.facebook.com/share/18BQgXmzzd/?mibextid=LQQJ4d",
      icon: faFacebookF,
    },
    {
      target: "https://www.instagram.com/reach_boats?igsh=ODluODFyb2s0NGhi&utm_source=qr",
      icon: faInstagram,
    },

  ];
  return (
    <footer>
      <div className="footer-menu">
        <div className="footer-parent">
          <ListAccordion
            title="About REACH"
            list={footerMenuOne}
            isOpen={openIndex === 0}
            toggleAccordion={() => toggleAccordion(0)}
          />
          {/* <ListAccordion
            title="Open Access"
            list={footerMenuTwo}
            isOpen={openIndex === 1}
            toggleAccordion={() => toggleAccordion(1)}
          />
          <ListAccordion
            title="For Members"
            list={footerMenuThree}
            isOpen={openIndex === 2}
            toggleAccordion={() => toggleAccordion(2)}
          /> */}
          <ListAccordion
            title="Legal"
            list={footerMenuFour}
            isOpen={openIndex === 3}
            toggleAccordion={() => toggleAccordion(3)}
          />
          <div className="menu-options first-menu">
            <h2 className="customHeading">Follow Us</h2>
            <ul className="menu-ul">
              {footerMenuFIve.map((item, index) => (

                <li className="menu-items" key={index}>
                  <a target="_blank" href={item.target}> <FontAwesomeIcon className="iconMenu" icon={item.icon} style={{ color: "#fff" }} /></a>
                </li>

              ))}
            </ul>
            <div className="appStore">
              <div className="playstore">
                <a className="link" target="_blank" href="https://play.google.com/store/apps/details?id=com.ReachYCLtd.Reach">
                  <img src={require("../../assets/images/footer/playstore.png")} alt="" />
                </a>
              </div>
              <div className="apple mx-1">
                <a className="link" target="_blank" href="https://apps.apple.com/in/app/reach-boats/id6615080231">
                  <img src={require("../../assets/images/footer/apple.png")} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="menu-options">
          <h2 className="customHeading">REACH News</h2>
          <div className="info-text">
            <p>Stay informed on News, Events, Offers and more</p>
            <div className="form">
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <CustomInput
                    name="user_email"
                    placeholder="Email Address"
                    type="email"
                    registerConfig={{
                      required: { value: true, message: "Email is required" }, // Specify required as an object with value and message
                    }}
                    className="footer-subscription"
                  />
                  <div style={{ color: "green" }} className="success">{message}</div>
                  <div className="sign-up-button">
                    <Button
                      onClick={() => console.log("Hello")}
                      text="Subscribe"
                      icon={true}
                      theme="light"
                    />
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="footer-bottom py-80">
          <Logo />
        </div>
        <div className="Copyright">
          <p className="Copyright-text">
            Copyright {new Date().getFullYear()} REACH Club. All rights reserved
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
