import React, { useState, createContext, useContext, ReactNode } from "react";
import AuthModal from "../components/AuthModal/AuthModal";
import MembershipModal from "../components/MembershipModal/MembershipModal";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import ChangePassword from "../features/ChangePassword/ChangePassword";
import PaymentModal from "../components/PaymentModal/PaymentModal";

export const MODAL_TYPES = {
  AUTH_MODAL: "AUTH_MODAL",
  MEMBERSHIP_MODAL: "MEMBERSHIP_MODAL",
  CONFIRM_MODAL: "CONFIRM_MODAL",
  CHANGE_PASSWORD_MODAL: "CHANGE_PASSWORD_MODAL",
  PAYMENT_MODAL: "PAYMENT_MODAL",
};

const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.AUTH_MODAL]: AuthModal,
  [MODAL_TYPES.MEMBERSHIP_MODAL]: MembershipModal,
  [MODAL_TYPES.CONFIRM_MODAL]: ConfirmModal,
  [MODAL_TYPES.CHANGE_PASSWORD_MODAL]: ChangePassword,
  [MODAL_TYPES.PAYMENT_MODAL]: PaymentModal,
};

type GlobalModalContext = {
  showModal: (modalType: string, modalProps?: any) => void;
  hideModal: () => void;
  store: any;
};

const initialState: GlobalModalContext = {
  showModal: () => { },
  hideModal: () => { },
  store: {},
};

const GlobalModalContext = createContext(initialState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

interface GlobalModalProps {
  children: ReactNode;
}

export const GlobalModal: React.FC<GlobalModalProps> = ({ children }) => {
  const [store, setStore] = useState(initialState.store);
  const { modalType, modalProps } = store || {};

  const showModal = (modalType: string, modalProps: any = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps,
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {},
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
