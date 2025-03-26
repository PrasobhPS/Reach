import { Heading } from "../../../components/Heading/Heading";
import "./Profile.scss";
import { MODAL_TYPES, useGlobalModalContext } from "../../../utils/GlobalModal";
export function GeneralSettings() {

    const { showModal } = useGlobalModalContext();
    const deactivateModal = () => {
        showModal(MODAL_TYPES.CONFIRM_MODAL, {
            title: "Deactivate Profile",
            details: "Are you sure you really want to deactivate the profile?",
            confirmBtn: "Deactivate",
        });
    };

    const deleteModal = () => {
        showModal(MODAL_TYPES.CONFIRM_MODAL, {
            title: "Delete Account?",
            details: "Are you sure you really want to delete the account?",
            confirmBtn: "Delete",
        });
    };


    return (
        <div className="col-md-12 col-12 py-2 General-Settings">
            <Heading tag="h3">General</Heading>
            <div className="general-setting-text notification-text">
                <Heading tag="h5">Manage Notifications</Heading>
                <p style={{ fontSize: "14px" }}>
                    Manage what type of emails you get and mute notifications.
                </p>
            </div>
            <div className="account-deactivation">
                <Heading tag="h5">
                    <span style={{ color: "#ff0075" }}>
                        <a style={{ cursor: "pointer" }} onClick={deactivateModal}>
                            Deactivate Account
                        </a>
                    </span>
                </Heading>
                <p style={{ fontSize: "14px" }}>
                    Deactivating will suspend your account until you sign back in.
                </p>
            </div>
            <div className="delete-account">
                <Heading tag="h5">
                    <span style={{ color: "#ff0075" }}>
                        <a style={{ cursor: "pointer" }} onClick={deleteModal}>
                            Delete Account
                        </a>
                    </span>
                </Heading>
                <p style={{ fontSize: "14px" }}>
                    Deleting will suspend your account permanently.
                </p>
            </div>
        </div>
    );
}