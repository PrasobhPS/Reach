import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { useUploadFileMutation } from "../FileUpload/FileUploadApiSlice";
import { useRemoveImageMutation } from "../../features/Cruz/Api/CruzMainApiSlice";
import "./MultiUpload.scss";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import Swal from "sweetalert2";
const chunkSize: number = 5 * 1024 * 1024;

interface FileUploadResponse {
  finalFilename: string;
  thumbnailPath?: string; // Optional property
}
interface FormValues {
  [key: string]: any;
}
interface CustomFile extends File {
  index: number;
  finalFilename?: string;
}
interface ProfileProps {
  getFileName?: (name: string | null) => void;
  folderName: string;
  name: string;
  formValues: FormValues;
  setValue: (name: string, value: any) => void;
}

export const MultiUploads: React.FC<ProfileProps> = ({
  getFileName = () => { },
  folderName,
  name,
  formValues,
  setValue,
}) => {
  const [uploadFile] = useUploadFileMutation();
  const [imageRemove] = useRemoveImageMutation();
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const [dropzoneActive, setDropzoneActive] = useState<boolean>(false);
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<
    number | null
  >(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(
    null
  );
  const [errors, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validFileTypes = [
    "video/mp4",
    "video/x-m4v",
    "video/*",
    "video/quicktime", // for .mov files
    "video/x-msvideo", // for .avi files
    "video/x-matroska", // for .mkv files
    "video/webm", // for .webm files
  ];
  const acceptTypes = validFileTypes.join(",");

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    const newFiles: File[] = Array.from(e.dataTransfer.files);
    //setFiles([...files, ...newFiles]);
    setDropzoneActive(false); // Ensure dropzone is deactivated after dropping files
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setLoading(true);
    const newFiles = Array.from(e.target.files || []);
    if (
      folderName === "profile-images" ||
      folderName === "employers" ||
      folderName === "employee" ||
      folderName === "job-images"
    ) {
      const validFileTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
      ];
      const isValidFileType =
        newFiles[0] && validFileTypes.includes(newFiles[0].type);
      if (isValidFileType) {
        setError("");
        const customFile: CustomFile = Object.assign(newFiles[0], { index });
        setFiles([...files, customFile]);
      } else {
        setLoading(false);
        Swal.fire({
          title: "Upload Failed!",
          text: "Invalid file format. Recommended: JPG, PNG, or GIF",
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
        setError("Invalid file format. Recommended: JPG, PNG, or GIF");
      }
    }
  };
  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setLoading(true);
    const newFiles = Array.from(e.target.files || []);

    if (
      folderName === "profile-images" ||
      folderName === "employers" ||
      folderName === "employee" ||
      folderName === "job-images"
    ) {
      const isValidFileType =
        newFiles[0] && validFileTypes.includes(newFiles[0].type);
      if (isValidFileType) {
        setError("");
        const customFile: CustomFile = Object.assign(newFiles[0], { index });
        setFiles([...files, customFile]);
      } else {
        setLoading(false);
        Swal.fire({
          title: "Upload Failed!",
          text: "Invalid file format. Recommended: mp4, webm, or mov",
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
        setError("Invalid file format. Recommended: JPG, PNG, or GIF");
      }
    }
  };

  function readAndUploadCurrentChunk(): void {
    const reader = new FileReader();
    const file = files[currentFileIndex as number];
    if (!file) {
      return;
    }
    const from: number = (currentChunkIndex as number) * chunkSize;
    const to: number = from + chunkSize;
    const blob: Blob = file.slice(from, to);
    reader.onload = (e: ProgressEvent<FileReader>) => uploadChunk(e);
    reader.readAsDataURL(blob);
  }
  function uploadChunk(readerEvent: ProgressEvent<FileReader>): void {
    const file: CustomFile = files[currentFileIndex as number];
    const data: string | ArrayBuffer | null =
      readerEvent.target?.result || null;

    if (data === null) return;

    let blobData: Blob;
    if (typeof data === "string") {
      // Convert string data to Blob
      blobData = new Blob([data], { type: "text/plain" }); // Adjust the type as per your data
    } else {
      // If data is already ArrayBuffer, create Blob directly
      blobData = new Blob([new Uint8Array(data as ArrayBuffer)]);
    }
    const formData = new FormData();
    formData.append("file", blobData, file.name);
    formData.append("name", file.name);
    formData.append("folderName", folderName);
    formData.append("size", file.size.toString());
    formData.append(
      "currentChunkIndex",
      (currentChunkIndex as number).toString()
    );
    formData.append("totalChunks", Math.ceil(file.size / chunkSize).toString());
    //console.log(file.type, "data");
    uploadFile(formData)
      .unwrap()
      .then((response: FileUploadResponse) => {
        const fileSize: number = files[currentFileIndex as number].size;
        const chunks: number = Math.ceil(fileSize / chunkSize) - 1;
        const isLastChunk: boolean = (currentChunkIndex as number) === chunks;

        if (isLastChunk) {
          const finalFilename: string = response.finalFilename;
          file.finalFilename = finalFilename;
          setLastUploadedFileIndex(currentFileIndex);
          setCurrentChunkIndex(null);
        } else {
          setCurrentChunkIndex((currentChunkIndex as number) + 1);
        }
        getFileName(response.finalFilename);
        if (file.type.startsWith("video/")) {
          setValue("employee_video", {
            thumb: response.thumbnailPath,
            video: response.finalFilename,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("File upload failed:", error);
      });
  }

  function handleManualUpload(): void {
    setCurrentChunkIndex(0);
    readAndUploadCurrentChunk();
  }

  function handleDragAreaClick(): void {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return;
    }
    const isLastFile: boolean = lastUploadedFileIndex === files.length - 1;
    const nextFileIndex: number | null = isLastFile
      ? null
      : (currentFileIndex as number) + 1;
    setCurrentFileIndex(nextFileIndex);
  }, [lastUploadedFileIndex, files]);

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null
            ? 0
            : (lastUploadedFileIndex as number) + 1
        );
      }
    }
  }, [files.length, lastUploadedFileIndex]);

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0);
    }
  }, [currentFileIndex]);
  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk();
    }
  }, [currentChunkIndex]);
  const uploadCount = {
    count: 5,
  };

  let accept = "";

  const handleRemoveImages = async (removeImage: string) => {
    try {
      setLoading(true);
      const removeData = {
        file_path: removeImage,
        file_type: folderName,
      };
      const response = await imageRemove(removeData);

      const updatedImages = formValues[name].filter(
        (image: string) => image !== removeImage
      );
      setValue(name, updatedImages);
      setThumbPath(null);
      setVideoPath(null);
      setValue("employee_video", {});
    } catch (error) {
      // Handle error response here
      console.error("Error saving job:", error);
    } finally {
      setLoading(false);
    }
  };

  const { showModal, hideModal } = useGlobalModalContext();

  const handleModalClose = () => {
    hideModal();
  };
  const removePicModal = (removeImage: string, type: string) => {
    showModal(MODAL_TYPES.CONFIRM_MODAL, {
      title: `Remove Selected ${type}`,
      details: `Are you sure you really want to delete the ${type}?`,
      confirmBtn: "Delete Image",
      onCloseCallback: handleModalClose,
      removeImage: removeImage,
      handleRemoveImages: (removeImage: string) => {
        handleRemoveImages(removeImage);
      },
    });
  };

  const [thumbPath, setThumbPath] = useState<string | null>(null);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const isVideoFile = (filename: string): boolean => {
    const videoExtensions = [".mp4", ".mov", ".wmv", ".flv", ".avi", ".mkv"];
    const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    return videoExtensions.includes(extension);
  };
  useEffect(() => {
    if (formValues["employee_video"]) {
      setThumbPath(formValues["employee_video"]["thumb"]);
      setVideoPath(formValues["employee_video"]["video"]);
    }
  }, [formValues["employee_video"]]);
  useEffect(() => {
    if (formValues["upload_media"]) {
      formValues["upload_media"]
        .filter((media: string) => {
          const videoExtensions = [
            "mp4",
            "avi",
            "mov",
            "wmv",
            "flv",
            "mkv",
            "webm",
          ];
          const extension = media.split(".").pop()?.toLowerCase();
          return videoExtensions.includes(extension || "");
        })
        .forEach((media: string) => {
          const filename = media.substring(media.lastIndexOf("/") + 1);
          const directory = media.substring(0, media.lastIndexOf("/"));
          const filenameWithoutExtension = filename
            .split(".")
            .slice(0, -1)
            .join(".");
          const thumbPath = `${directory}/thumb_${filenameWithoutExtension}.jpg`;
          setThumbPath(thumbPath);
          setVideoPath(media);
        });
    }
  }, [formValues["upload_media"]]);

  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif"];
  const imageFiles =
    formValues[name] &&
    formValues[name].filter((file: string) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext))
    );
  return (
    <div className="row multipleupload-sections">
      {[...Array(uploadCount.count)].map((_, index) => {
        const filePath = imageFiles && imageFiles[index];
        return (
          <div className="col-xl-4 col-4 multipleupload" key={index}>
            {filePath && !isVideoFile(filePath) ? (
              <>
                <div className="grid-imageupload">
                  <img
                    key={index}
                    src={`${baseUrl}/${filePath}`}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="action-buttonsoption">
                  <div className="close-option">
                    <a onClick={() => removePicModal(filePath, "Image")}>
                      <img
                        src={require("../../assets/images/cruz/close.png")}
                        alt="Profile"
                        className="imgfluid"
                      />
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                {loading ? (
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
                ) : (
                  <div className="grid-imageupload">
                    <img
                      key={index}
                      src={require("../../assets/images/cruz/default-img.png")}
                      alt=""
                      className="img-fluid default-img"
                    />
                  </div>
                )}
                <div className="action-buttonsoption">
                  <div className="plus">
                    <div className="multiple-fileuploads">
                      <div className="file-input-container">
                        <input
                          key={index}
                          type="file"
                          id={`file-input-${index}`}
                          className="file-input"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                        <label
                          htmlFor={`file-input-${index}`}
                          className="file-input-label"
                        >
                          <img
                            src={require("../../assets/images/cruz/plus.png")}
                            alt="Profile"
                            className="imgfluid"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Code for video upload */}
      <div className="col-xl-4 col-4 multipleupload">
        {thumbPath && videoPath && thumbPath ? (
          <>
            <div className="grid-imageupload">
              <img
                src={`${baseUrl}/${thumbPath}`}
                alt=""
                className="img-fluid"
              />
            </div>
            <div className="action-buttonsoption">
              <div className="close-option">
                <a onClick={() => removePicModal(videoPath, "Video")}>
                  <img
                    src={require("../../assets/images/cruz/close.png")}
                    alt="Profile"
                    className="imgfluid"
                  />
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid-imageupload">
              <img
                src={require("../../assets/images/cruz/video.png")}
                alt=""
                className="img-fluid default-img"
              />
            </div>
            <div className="action-buttonsoption">
              <div className="plus">
                <div className="multiple-fileuploads">
                  <div className="file-input-container">
                    <input
                      type="file"
                      id="file-input"
                      accept="video/*"
                      className="file-input"
                      onChange={(e) => handleVideoChange(e, 6)}
                    />
                    <label htmlFor="file-input" className="file-input-label">
                      <img
                        src={require("../../assets/images/cruz/plus.png")}
                        alt="Profile"
                        className="imgfluid"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {errors && <p className="error">{errors}</p>}
      <div className="caption-text">
        <span>(We recommend one video with you speaking, max 1 minute)</span>
      </div>
    </div>
  );
};
export default MultiUploads;
