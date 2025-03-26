import { FormProvider, useForm } from "react-hook-form";
import { Heading } from "../../../components/Heading/Heading";
import "./Profile.scss";
import CustomInput from "../../../components/CustomInput/CustomInput";
import { Button } from "../../../components/Button/Button";
import { NavLink } from "react-router-dom";
import { ProfileData } from "../../../types/ProfileData";
import { DobPicker } from "../../../components/DobPicker/DobPicker";
import {
  useUpdateProfileMutation,
  useRemovePictureMutation,
} from "../profileApiSlice";
import { getUserData } from "../../../utils/Utils";
import { ProfileFileUpload } from "../../../components/FileUpload/ProfileFileUpload";
import { useEffect, useState } from "react";
import { useProfileMutation } from "../profileApiSlice";
import CountryPicker from "../../../components/CountryPicker/CountryPicker";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal";
import { MODAL_TYPES, useGlobalModalContext } from "../../../utils/GlobalModal";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TelephoneField } from "../../../components/TelephoneField/TelephoneField";
import Swal from "sweetalert2";

interface Props {
  profileData: ProfileData;
  toggle: () => void;
}

export const EditProfile: React.FC<Props> = ({ profileData, toggle }) => {
  const [profileDatas, setProfileData] = useState(profileData);
  const [errorMsg, setErrorMsg] = useState<string>('');
  useEffect(() => {
    if (profileData.members_phone_code) {
      setProfileData((prevData) => ({
        ...prevData,
        phone_code: profileData.members_phone_code,
      }));
    }
  }, [profileData]);
  // console.table(profileDatas);

  const [fileName, setFileName] = useState<string | null>(null);
  const userData = getUserData("userData");
  let token = "";
  let memberType = "";
  try {
    if (userData !== null) {
      token = userData.Token;
      memberType = userData.Member_type;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const form = useForm<ProfileData>({ defaultValues: profileDatas });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  let originalDate = "0000-00-00";
  if (profileData.members_dob) originalDate = profileData.members_dob;
  const [year, month, day] = originalDate.split("-").map((value) => {
    const parsedValue = parseInt(value, 10);
    return parsedValue < 10 ? parsedValue.toString() : parsedValue;
  }) as [number, number, number];
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const onSubmit = async (data: ProfileData) => {
    // data.members_dob = data.dobYear + "-" + data.dobMonth + "-" + data.dobDay;
    // const yearStr = data.dobYear.toString();
    // const monthStr =
    //   parseInt(data.dobMonth) < 10
    //     ? "0" + data.dobMonth.toString()
    //     : data.dobMonth.toString();
    // const dayStr =
    //   parseInt(data.dobDay) < 10
    //     ? "0" + data.dobDay.toString()
    //     : data.dobDay.toString();

    // data.members_dob = yearStr + "-" + monthStr + "-" + dayStr;

    // const { dobDay, dobMonth, dobYear } = data.members_dob_data;
    // const dob = `${dobYear}-${String(dobMonth).padStart(2, "0")}-${String(
    //   dobDay
    // ).padStart(2, "0")}`;
    // data.members_dob = dob;
    data.members_phone_code = data.phone_code;
    // console.log("Form Submitted", data);
    const userData: any = await updateProfile({ credentials: data, token: token });
    if ("error" in userData) {
      if (userData.error) {
        if ('data' in userData.error && userData.error.data?.error) {
          // This handles the case where error data exists
          setErrorMsg(userData.error.data.error);
        } else {
          // Optional: Handle other types of errors (e.g., SerializedError)
          setErrorMsg('An unexpected error occurred');
        }
      }
      console.error("Error logging in:", userData.error);
    } else {
      // console.log(userData.data.success, "user");
      setErrorMsg('');
      getProfile();
      toggle();
    }
  };
  const [showUpload, setShowUpload] = useState(false);
  const changeProfilePic = () => {
    setShowUpload(true);
  };
  const [profileMutation] = useProfileMutation();
  const getProfile = async () => {
    const response = await profileMutation(token);
    if ("error" in response) {
      console.error("Error logging in:", response.error);
    } else {
      setProfileData(response.data.data);
      setShowUpload(false);
    }
  };
  const [removePicture] = useRemovePictureMutation();
  const removePic = async () => {
    const remove = await removePicture(token);
    if ("error" in remove) {
      console.error("Error logging in:", remove.error);
    } else {
      getProfile();
      // localStorage.setItem("userData", JSON.stringify(userData.data.data));
    }
  };
  const getFileName = (name: string | null) => {
    // console.log(name, "name");

    setFileName(name);
    getProfile();
  };
  const { showModal } = useGlobalModalContext();

  const handleModalClose = () => {
    getProfile(); // Call getProfile() after the modal closes
  };

  const removePicModal = () => {
    if (profileDatas.members_profile_picture) {
      showModal(MODAL_TYPES.CONFIRM_MODAL, {
        title: "Remove Profile Picture",
        details: "Are you sure you really want to delete the profile picture?",
        confirmBtn: "Remove",
        onCloseCallback: handleModalClose,
      });
    } else {
      showModal(MODAL_TYPES.CONFIRM_MODAL, {
        title: "Profile Picture Not Found !",
        // details: "Profile picture not added",
        // confirmBtn: "Remove",
        onCloseCallback: handleModalClose,
      });
    }
  };

  const deleteModal = () => {
    showModal(MODAL_TYPES.CONFIRM_MODAL, {
      title: "Delete Account?",
      details: "Are you sure you really want to delete the account?",
      confirmBtn: "Delete",
    });
  };

  const [country, setCountry] = useState(profileDatas.members_country);
  const handleCountrySelect = (country: string) => {
    setCountry(country);
  };
  const changePassword = () => {
    showModal(MODAL_TYPES.CHANGE_PASSWORD_MODAL, {
      title: "Change Password",
    });
  };
  const [countryError, setCountryError] = useState<string>('');
  const handleCountryChange = async (country: { name: string; iso: string }) => {
    if (memberType === 'M' && country.name === 'United States') {

      setCountryError('Currently the full membership option is not available for American residents');
      Swal.fire({
        title: "",
        text: "Currently the full membership option is not available for American residents",
        icon: "warning",
        showConfirmButton: true,
        backdrop: `
        rgba(255, 255, 255, 0.5)
        left top
        no-repeat
        filter: blur(5px);
      `,
        background: '#fff',
      });
    } else {
      setCountryError('');
    }
  }

  return (
    <div className="profile-form">
      <div className="row">
        <div className="col-md-6 col-12 img-box">
          <div className="row">
            <div className="col-md-6">
              <Heading tag="h5" className="profile-pic">
                Profile Picture
              </Heading>
              <div className="edit-image-container">
                {profileDatas.members_profile_picture ? (
                  <img
                    src={profileDatas.members_profile_picture}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <img
                    src={require("../../../assets/images/profile/Default.jpg")}
                    alt="Profile"
                    className="profile-image"
                  />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="nav-link-actions">
                <div className="row">
                  <div className="col-md-6 col-4">
                    <NavLink
                      to="#"
                      onClick={() => changeProfilePic()}
                      className="update-pic"
                    >
                      Update
                    </NavLink>
                  </div>
                  <div className="col-md-6 col-4">
                    <NavLink
                      to="#"
                      onClick={removePicModal}
                      className="remove-pic"
                    >
                      Remove
                    </NavLink>
                  </div>
                </div>
                <p>
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels
                  per side.
                </p>
              </div>
            </div>
            {showUpload ? (
              <ProfileFileUpload
                getFileName={getFileName}
                folderName="profile-images"
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-md-6 col-12 content-box">
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <label>Title</label>
              <CustomInput
                name="members_name_title"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: true, message: "Title is required" },
                }}
                className="input-block"
              />
              <label>First Name</label>
              <CustomInput
                name="members_fname"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: true, message: "First Name is required" },
                }}
                className="input-block"
              />
              <label>Surname</label>
              <CustomInput
                name="members_lname"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: true, message: "Surname is required" },
                }}
                className="input-block"
              />
              <label>Phone</label>
              <TelephoneField
                name="members_phone"
                registerConfig={{
                  required: { value: false, message: "Phone is required" },
                }}
                initialValue={profileDatas.members_phone_code}
              />
              <label>Email Address</label>
              <CustomInput
                name="members_email"
                placeholder=""
                type="email"
                registerConfig={{
                  required: { value: true, message: "Email is required" },
                }}
                className="input-block"
              />
              <NavLink
                to="#"
                onClick={changePassword}
                style={{ color: "#fff" }}
              >
                Change Password
              </NavLink>
              <div className="dob-picker"></div>
              <label>Address</label>
              <CustomInput
                name="members_address"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "Address is required" },
                }}
                className="input-block"
              />

              <label>Town</label>
              <CustomInput
                name="members_town"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "Town is required" },
                }}
                className="input-block"
              />


              <label>Region / County</label>
              <CustomInput
                name="members_region"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "Region is required" },
                }}
                className="input-block"
              />
              <label>Postcode</label>
              <CustomInput
                name="members_postcode"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "Postcode is required" },
                }}
                className="input-block"
              />
              <label>Country</label>
              <CountryPicker
                name="members_country"
                registerConfig={{
                  required: { value: false, message: "Country is required" },
                }}
                handleChange={handleCountryChange}
              />
              <label>Current Employment</label>
              <CustomInput
                name="members_employment"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "Employment is required" },
                }}
                className="input-block"
              />
              <label>Employment History</label>
              <CustomInput
                name="members_employment_history"
                placeholder=""
                type="text"
                registerConfig={{
                  required: {
                    value: false,
                    message: "Employment History is required",
                  },
                }}
                className="input-block"
              />
              <label>About Me</label>
              <CustomInput
                name="members_biography"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "About is required" },
                }}
                className="input-block"
              />
              <label>Interests</label>
              <CustomInput
                name="members_interest"
                placeholder=""
                type="text"
                registerConfig={{
                  required: { value: false, message: "Interests is required" },
                }}
                className="input-block"
              />
              <div className="error">{errorMsg}</div>
              <Button
                onClick={() => console.log("Hello")}
                text="Update and Save"
                icon={true}
                theme="light"
                className="w-100 Update-save"
              />
            </form>
          </FormProvider>
          <div className="row sub-box">
            <div className="col-12 text-center">
              <a
                style={{ cursor: "pointer", color: "#ff0075" }}
                onClick={deleteModal}
              >
                Delete Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
