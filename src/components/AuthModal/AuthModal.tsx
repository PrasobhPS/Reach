import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import "../../assets/scss/membership.scss";
import { Login } from "../../features/Login/Login";
import { Register } from "../../features/Register/Register";
import { useGlobalModalContext } from "../../utils/GlobalModal";
import { ForgotPassword } from "../../features/ForgotPassword/ForgotPassword";
import { useLocation, useNavigate } from "react-router-dom";
function AuthModal() {
  // const { authModal, toggleAuthModal } = useModal();
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setForgot] = useState(false);
  const navigate = useNavigate();
  const handleSignUpClick = () => {
    hideModal();
    navigate("/joinmembership");
  };
  const handleSignInClick = () => {
    setShowRegister(false);
    setForgot(false);
  };
  const handleForgotClick = () => {
    setForgot(true);
  };
  const { hideModal, store } = useGlobalModalContext();
  const { modalProps } = store || {};
  const { title, confirmBtn } = modalProps || {};

  const handleModalToggle = () => {
    navigate("/");
    hideModal();
  };
  // console.log(authModal, "auth");
  return (
    <div>
      <Modal
        title={title || "Sign In"}
        isOpen={true}
        onClose={handleModalToggle}
        centered
        className="login-modal modal-setups"
      >
        <ModalBody>
          <ModalHeader toggle={handleModalToggle}></ModalHeader>
          {showRegister ? (
            <Register
              onSignInClick={handleSignInClick}
              toggleModal={handleModalToggle}
            />
          ) : showForgot ? (
            <ForgotPassword
              onSignInClick={handleSignInClick}
              toggleModal={handleModalToggle}
            />
          ) : (
            <Login
              onSignUpClick={handleSignUpClick}
              onForgotClick={handleForgotClick}
              toggleModal={handleModalToggle}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AuthModal;
