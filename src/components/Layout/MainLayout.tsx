import { Outlet, useNavigate } from "react-router-dom";
import { MainLayoutProps } from "../../types";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Suspense, useEffect, useState } from "react";
import { ChatList } from "../../features/Chat/PrivateChat/ChatList/ChatList";
import SingleChatMain from "../../features/Chat/PrivateChat/SingleChatMain/SingleChatMain";
import EnvelopeIcon from "../../features/Chat/PrivateChat/components/EnvelopeIcon";
import { useLocation } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { setUserData, getUserData } from "../../utils/Utils";
import { Button } from "../Button/Button";
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export const MainLayout = (props: MainLayoutProps) => {
  const [modal, setModal] = useState(false);
  const location = useLocation();
  const urlPartWithSlash = location.pathname;
  let urlPart = urlPartWithSlash.substring(1);
  const { socket } = useSocket();
  const [actionText,setActionText] = useState('Expired');

  const navigate = useNavigate();
  const toggle = () => {
    setModal(!modal); 
  };
 const handleClick = () => {
    setModal(!modal); 
    navigate("/");
  };

  useEffect(() => {
    if (!socket?.connected) return;
    
    socket?.on('changeMembership', (data:any) => {

      const user = getUserData("userData");
      
      if(user){
        user.Member_type = data.memberType 
        user.is_specialist = data.isSpecialist 
        setUserData(user)
      }

      if(data.memberType == 'M'){
          setActionText('Upgraded')
      }else{
          setActionText('Expired')
      }
      toggle();
    });

    socket?.on('updateSpecialist', (data:any) => {

      const user = getUserData("userData");
      
      if(user){
        user.is_specialist = data.isSpecialist 
        setUserData(user)
      }

    });
}, [socket]);

  return (
    <>
      {location.pathname === '/terms' || location.pathname === '/privacypage' || urlPart.split('/')[0] === 'paymentpage' ? (
        <main>
          {props.children}
        </main>

      ) : (
        <>
          <Header />
          <main>
            <Suspense
              fallback={
                <div className="page-loader">
                  <div className="page-innerLoader">
                    <div className="spinner-border" role="status">
                      <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                    </div>
                  </div>
                </div>
              }
            >
              {props.children}
            </Suspense>
          </main>
          <Footer />
          <ChatList />
          <SingleChatMain />
          <EnvelopeIcon />
          
          {/* modal */}

          
            <Modal
              isOpen={modal}
              toggle={toggle}
              centered
              className="layoutmodal"
              backdrop="static"
              keyboard={false}
            >
            <ModalHeader >
              <div className="text-white" >
                <FontAwesomeIcon icon={faClose} onClick={() => handleClick()}/>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="icon d-block">
                <FontAwesomeIcon icon={faInfoCircle}/>
              </div>
              Your membership has been {actionText}!
            </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => handleClick()}
                  text="goto HOME"
                  icon={true}
                  theme="light"
                  className={``}
                />
              </ModalFooter>
            </Modal>
        </>
      )}
    </>
  );
};
