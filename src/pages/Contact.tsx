import React, { useState } from "react";
import { Hero } from "../components/Hero/Hero";
import { Heading } from "../components/Heading/Heading";
import "../assets/scss/contact.scss";
import ContactForm from "../features/Contact/ContactForm";
function Contact() {
  return (
    <div className="App">

      <Hero
        className="contact-headtext"
        source={require("../assets/images/contact/banner-1.jpeg")}
        title="Get in touch"
      >
        <div className="inner-child" style={{ textAlign: "center" }}>
          <div className="row w-100"></div>
        </div>
      </Hero>
      <div className="container">
        <div className="contact-div">
          <div className="row">
            <div className="col-md-4">
              <div className="contact-details">
                <Heading tag="h3">
                  <p className="top-line">Contact Us</p>
                </Heading>
                <div className="enquiry">
                  <Heading tag="h5">General Enquiries</Heading>
                  <p>
                    <a href="mailto:info@reach.boats" style={{ color: "#fff" }}>info@reach.boats</a>
                  </p>
                </div>
                <div className="enquiry">
                  <Heading tag="h5">Marketing Enquiries</Heading>
                  <p><a href="mailto:partners@reach.boats" style={{ color: "#fff" }}>partners@reach.boats</a></p>
                </div>
                {/* <div className="enquiry">
                  <Heading tag="h5">Event Enquiries</Heading>
                  <p>membership@reachclub.com</p>
                </div> */}
              </div>
            </div>
            <div className="col-md-4">
              <ContactForm />
            </div>
            <div className="col-md-4">
              <div className="contact-details on-Social">
                <Heading tag="h3">
                  <p className="top-line">Join us on Social</p>
                </Heading>

                <div className="enquiry">
                  <Heading tag="h5">
                    <a href="https://www.facebook.com/share/18BQgXmzzd/?mibextid=LQQJ4d" className="link">Facebook</a>
                  </Heading>
                  <a href="https://www.facebook.com/share/18BQgXmzzd/?mibextid=LQQJ4d" className="link">
                    <p>REACH BOATS</p>
                  </a>
                </div>

                <div className="enquiry">
                  <Heading tag="h5">
                    <a href="https://www.instagram.com/reach_boats?igsh=ODluODFyb2s0NGhi&utm_source=qr" className="link">
                      Instagram
                    </a>
                  </Heading>
                  <a href="https://www.instagram.com/reach_boats?igsh=ODluODFyb2s0NGhi&utm_source=qr" className="link">
                    <p>@reach_boats</p>
                  </a>
                </div>
                <div className="enquiry">
                  <Heading tag="h5">
                    <a href="https://x.com/ReachBoats" className="link">
                      Twitter
                    </a>
                  </Heading>
                  <a href="https://www.facebook.com/share/18BQgXmzzd/?mibextid=LQQJ4d" className="link">
                    <p>@ReachBoats</p>
                  </a>
                </div>
                {/* <div className="enquiry">
                  <Heading tag="h5">Linkedin</Heading>
                  <p>@thereachclub</p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
