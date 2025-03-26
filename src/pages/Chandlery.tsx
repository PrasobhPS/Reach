import React, { useEffect, useRef, useState } from "react";
import { Hero } from "../components/Hero/Hero";
import { TwoColumnImageBox } from "../components/TwoColumnImageBox/TwoColumnImageBox";
import { Button } from "../components/Button/Button";
import { Heading } from "../components/Heading/Heading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import MenuSlider from "../components/MenuSlider/MenuSlider";
import { getUserData } from "../utils/Utils";
import { MODAL_TYPES, useGlobalModalContext } from "../utils/GlobalModal";
import "../../src/assets/scss/chandlery.scss";
import { CmsHeader } from "../components/CmsHeader/CmsHeader";
import { useChandleryQuery, useGetCouponCodeMutation } from "../features/Chandlery/ChandleryApiSlice";
import { CustomSlider } from "../components/CustomSlider/CustomSlider";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

interface ChandleryData {
  id: number;
  logo?: string;
  image: string;
  name: string;
  discription: string;
  discount: number | "";
  coupon: string | null;
  website: string | "";
  show_coupon_code?: number;

}

const Chandlery = () => {
  const userData = getUserData("userData");
  let memberType = "";
  let token = "";
  let member_id = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
      token = userData.Token;
      member_id = userData.Member_id;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };

  const location = useLocation();
  const [chandlerydata, setChandlerydata] = useState<ChandleryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    data: chandleryDetails = {},
    isLoading: chandleryLoading,
    isSuccess,
    refetch
  } = useChandleryQuery({}, { skip: !token });
  const [getCouponCode] = useGetCouponCodeMutation();

  useEffect(() => {
    if (isSuccess && chandleryDetails.data) {
      const transformedData = chandleryDetails.data.map((item: {
        id: string;
        chandlery_coupon_code: string;
        chandlery_description: string;
        chandlery_discount: string;
        chandlery_image: string;
        chandlery_name: string;
        chandlery_website: string;
        chandlery_logo: string;
        show_coupon_code: number;
      }) => ({
        id: item.id,
        logo: item.chandlery_logo ? `${chandleryDetails.filePath}/${item.chandlery_logo}` : null,
        image: `${chandleryDetails.filePath}/${item.chandlery_image}`,
        name: item.chandlery_name,
        discription: item.chandlery_description,
        discount: item.chandlery_discount,
        coupon: item.chandlery_coupon_code,
        website: item.chandlery_website,
        show_coupon_code: item.show_coupon_code,
      }));
      setChandlerydata(transformedData);
    }
  }, [chandleryDetails, isSuccess]);



  useEffect(() => {
    if (memberType !== "M") memberModal();

  }, []);

  const couponRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const chandleryId = location.state?.chandlery_id || null;
  useEffect(() => {
    if (chandleryId && couponRefs.current[chandleryId]) {
      couponRefs.current[chandleryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [chandleryId, chandlerydata]);
  const handleCopyClick = (couponCode: string | null, id: number) => {
    if (!couponCode) {
      console.error("Coupon code is empty");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(couponCode)
        .then(() => {
          setbuttonCopied(id);
        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
        });
    } else {
      console.error("Clipboard API not available");
      fallbackCopyTextToClipboard(couponCode, id);
    }
  };

  const fallbackCopyTextToClipboard = (text: string, id: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      setbuttonCopied(id);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  };

  const [buttonCopied, setbuttonCopied] = useState(0);
  const [codeGenerated, setcodeGenerated] = useState(0);

  const handleGenerateCode = async (id: number) => {

    try {
      const passData = {
        id: id
      }
      const response = await getCouponCode(passData);

      if ('data' in response && response.data?.success) {
        refetch();
      } else if ('error' in response) {
        console.error('Error:', response.error?.message || 'Something went wrong');
        //alert(response.error?.message || 'Something went wrong');
      } else {
        console.error('Unexpected response:', response);
        Swal.fire({
          title: "No Code!",
          text: response.data.message,
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "OK",
          backdrop: `
                                                      rgba(255, 255, 255, 0.5)
                                                      left top
                                                      no-repeat
                                                      filter: blur(5px);
                                                    `,
          background: "#fff",
        }).then(async (result) => { });

      }
    } catch (error) {
      console.error('API call failed:', error);
      alert('Failed to fetch coupon code. Please try again later.');
    }
  }

  const links = [
    { url: "#1", text: "All" },
    { url: "#2", text: "Gear" },
    { url: "#3", text: "Clothing" },
    { url: "#4", text: "Sailing" },
    { url: "#5", text: "Yachts" },
    { url: "#6", text: "Accessories" },
    { url: "#7", text: "Restorents" },
    { url: "#8", text: "Others" },
  ];

  const slides = [
    { alt: "", title: "All" },
    { alt: "", title: "Gear" },
    { alt: "", title: "Clothing" },
    { alt: "", title: "Sailing" },
    { alt: "", title: "Yachts" },
    { alt: "", title: "Accessories" },
    { alt: "", title: "Restorents" },
    { alt: "", title: "Others" },
  ];

  const slidesettings = {
    dots: false,
    centerPadding: "0px",
    infinite: false,
    slidesToShow: 8,
    slidesToScroll: 1,
    draggable: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          arrows: true,
          centerPadding: "0px",
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          arrows: true,
          centerPadding: "0px",
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 640,
        settings: {
          arrows: true,
          centerPadding: "10",
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
          centerPadding: "10",
          slidesToShow: 5,
        },
      },
    ],
  };

  const firstChandleryItem = chandlerydata[0];
  const remainingChandleryData = chandlerydata.slice(1);

  const handleClick = (website: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (member_id) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "links_click",
        userId: member_id, // Replace with dynamic user ID
        altsLink: `${website}`
      });
    }
    window.open(website, "_blank");

  };
  return (
    <div className="App">
      <div className="Chandlery-page">
        <CmsHeader links={links} />
        {/* <div className="menu-sliderslick">
          <CustomSlider settings={slidesettings} items={slides} />
        </div> */}
        <div className="container-fluid Chandlery-pagecontainer">
          <div className="row">

            {firstChandleryItem && (
              <div className="col-12 header-parentbox" key={firstChandleryItem.id}
                ref={(el) => (couponRefs.current[firstChandleryItem.id] = el)}
                tabIndex={-1}>
                <TwoColumnImageBox
                  source={firstChandleryItem.image}
                  swapColumn={false}
                  isBackground={true}
                  logo={firstChandleryItem.logo}
                >
                  <div className="coupon-container">
                    {/* <ul className="cat-list">
                      <li>Cloths</li>
                      <li>Accessories</li>
                    </ul> */}
                    <div className="offer-label">{firstChandleryItem.discount}% OFF</div>
                    <Heading>{firstChandleryItem.name}</Heading>
                    <p>{firstChandleryItem.discription}</p>
                    {firstChandleryItem.show_coupon_code === 1 && (
                      <div className="coupon-code" >
                        <input
                          type="text"
                          className="form-control"
                          value={firstChandleryItem.coupon || ''}
                        />

                        <Button
                          onClick={firstChandleryItem.coupon ? () => handleCopyClick(firstChandleryItem.coupon, firstChandleryItem.id) : () => handleGenerateCode(firstChandleryItem.id)}
                          text={firstChandleryItem.coupon ? "Copy Code" : "Get Code"}
                          icon={false}
                          theme="dark"
                        />

                      </div>
                    )}
                    {firstChandleryItem.website && (
                      (() => {
                        try {
                          const url = new URL(firstChandleryItem.website);
                          const domainName = url.hostname;
                          return (
                            <a className="visiturl alts_link" onClick={(e) => {

                              handleClick(firstChandleryItem.website, e)
                            }} target="_blank" rel="noopener noreferrer">
                              Visit {domainName}
                              <span className="btn-icon">
                                <FontAwesomeIcon icon={faAngleRight} />
                              </span>
                            </a>
                          );
                        } catch (error) {
                          console.error("Error parsing website URL:", error);
                          return (
                            <a className="visiturl" href={firstChandleryItem.website} target="_blank" rel="noopener noreferrer">
                              Visit {firstChandleryItem.website}
                              <span className="btn-icon">
                                <FontAwesomeIcon icon={faAngleRight} />
                              </span>
                            </a>
                          );
                        }
                      })()
                    )}
                  </div>
                </TwoColumnImageBox>
              </div>
            )}
          </div>
          <div className="row">
            {remainingChandleryData.map((chandleryData) => (
              <div className="col-md-6 more-card-field" key={chandleryData.id}
                ref={(el) => (couponRefs.current[chandleryData.id] = el)}
                tabIndex={-1}>
                <TwoColumnImageBox
                  source={chandleryData.image}
                  swapColumn={false}
                  isBackground={true}
                  logo={chandleryData.logo}
                >
                  <div className="coupon-container">
                    {/* <ul className="cat-list">
                      <li>Cloths</li>
                      <li>Accessories</li>
                    </ul> */}
                    <div className="offer-label">{chandleryData.discount}% OFF</div>
                    <Heading>{chandleryData.name}</Heading>
                    <p>{chandleryData.discription}</p>
                    {chandleryData.show_coupon_code === 1 && (
                      <div className="coupon-code" >
                        <input
                          type="text"
                          className="form-control"
                          value={chandleryData.coupon || ''}
                        />

                        <Button
                          onClick={chandleryData.coupon ? () => handleCopyClick(chandleryData.coupon, chandleryData.id) : () => handleGenerateCode(chandleryData.id)}
                          text={chandleryData.coupon ? "Copy Code" : "Get Code"}
                          icon={false}
                          theme="dark"
                        />

                      </div>
                    )}
                    {chandleryData.website && (
                      (() => {
                        try {
                          const url = new URL(chandleryData.website);
                          const domainName = url.hostname;
                          return (
                            <a className="visiturl alts_link" onClick={(e) => {

                              handleClick(chandleryData.website, e)
                            }} target="_blank" rel="noopener noreferrer">
                              Visit {domainName}
                            </a>
                          );
                        } catch (error) {
                          console.error("Error parsing website URL:", error);
                          return (
                            <a className="visiturl alts_link" onClick={(e) => {

                              handleClick(chandleryData.website, e)
                            }} target="_blank" rel="noopener noreferrer">
                              Visit {chandleryData.website}
                            </a>
                          );
                        }
                      })()
                    )}
                  </div>
                </TwoColumnImageBox>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chandlery;
