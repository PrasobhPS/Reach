import React, { useState } from "react";
import { useRemoveImageMutation } from "../../features/Cruz/Api/CruzMainApiSlice";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";

interface FormValues {
    [key: string]: any;
}
interface ImageProps {
    imageKey: string;
    formValues: FormValues;
    folderName: string;
    setValue: (name: string, value: any) => void;
}

const ShowImages: React.FC<ImageProps> = ({ formValues, folderName, imageKey, setValue }) => {

    const baseUrl = process.env.REACT_APP_STORAGE_URL;

    const [imageRemove] = useRemoveImageMutation();
    const [loading, setLoading] = useState(false);
    const handleRemoveImages = async (removeImage: string) => {
        try {
            setLoading(true);
            const removeData = {
                file_path: removeImage,
                file_type: folderName
            };
            const response = await imageRemove(removeData);

            const updatedImages = formValues[imageKey].filter((image: string) => image !== removeImage);
            setValue(imageKey, updatedImages);
        } catch (error) {
            // Handle error response here
            console.error("Error saving job:", error);
        } finally {
            setLoading(false);
        }
    }

    const { showModal, hideModal } = useGlobalModalContext();

    const handleModalClose = () => {
        hideModal();
    }
    const removePicModal = (removeImage: string) => {
        showModal(MODAL_TYPES.CONFIRM_MODAL, {
            title: "Remove Selected image",
            details: "Are you sure you really want to delete the image?",
            confirmBtn: "Delete Image",
            onCloseCallback: handleModalClose,
            removeImage: removeImage,
            handleRemoveImages: (removeImage: string) => {
                handleRemoveImages(removeImage);
            }


        });
    };

    let content: JSX.Element | null = null;

    if (loading) {
        content = (
            <div className="page-loader">
                <div className="page-innerLoader">
                    <div className="spinner-border" role="status">
                        <img
                            src={require("../../assets/images/cruz/Frame.png")}
                            alt=""
                            className="img-fluid"
                        />
                    </div>
                </div>
            </div>
        );
    } else {
        const images = Array.isArray(formValues[imageKey]) ? formValues[imageKey] : [];
        content = (
            <>
                {images.map((image: string, index: number) => (
                    <div className="col-xl-4 col-6 imageupload-option" key={image}>
                        <div className="grid-imageupload">
                            <img src={`${baseUrl}/${image}`} alt="" className="img-fluid" />
                        </div>
                        <div className="action-buttonsoption">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    removePicModal(image);
                                }}
                            >
                                <img
                                    src={require("../../assets/images/cruz/close.png")}
                                    alt="Close"
                                    className="img-fluid"
                                />
                            </a>
                        </div>
                    </div>
                ))}
            </>
        );
    }


    return <>{content}</>;

};

export default ShowImages;
