import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FileUpload.scss";
import { getUserData } from "../../utils/Utils";
import { useUploadFileMutation } from "./FileUploadApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ImageCropper from "../../features/Profile/Components/ImageCropper";


const chunkSize: number = 5 * 1024 * 1024;

interface CustomFile extends File {
    finalFilename?: string;
}

interface ProfileProps {
    getFileName?: (name: string | null) => void;
    folderName: string;
    from?: string;
}

export const ProfileFileUpload: React.FC<ProfileProps> = ({
    getFileName = () => { },
    folderName,
    from,
}) => {
    const [uploadFile] = useUploadFileMutation();
    const [dropzoneActive, setDropzoneActive] = useState<boolean>(false);
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
    const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<number | null>(null);
    const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // New states for image cropping
    const [showCropper, setShowCropper] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null);

    function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
        e.preventDefault();
        const droppedFiles: File[] = Array.from(e.dataTransfer.files);

        if (droppedFiles.length > 0) {
            handleNewFile(droppedFiles[0]);
        }

        setDropzoneActive(false);
    }

    function handleNewFile(file: File) {
        if (folderName === "profile-images" || folderName === "employers" || folderName === "job-images") {
            if (
                file.type === "image/png" ||
                file.type === "image/jpg" ||
                file.type === "image/jpeg" ||
                file.type === "image/gif"
            ) {
                setError("");
                const reader = new FileReader();
                reader.onload = () => {
                    setImageToEdit(reader.result as string);
                    setShowCropper(true);
                };
                reader.readAsDataURL(file);
            } else {
                setError("Invalid file format. Recommended:JPG, PNG, or GIF");
            }
        }
    }

    const handleCroppedImage = async (croppedImage: string) => {
        try {
            // Convert base64 to file
            const response = await fetch(croppedImage);
            const blob = await response.blob();
            const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

            setFiles([...files, file]);
            setShowCropper(false);
            setImageToEdit(null);

            // Trigger upload process
            setCurrentFileIndex(files.length);
            setCurrentChunkIndex(0);
        } catch (error) {
            console.error('Error processing cropped image:', error);
            setError('Error processing cropped image');
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
        const data: string | ArrayBuffer | null = readerEvent.target?.result || null;

        if (data === null) return;

        let blobData: Blob;
        if (typeof data === "string") {
            blobData = new Blob([data], { type: "text/plain" });
        } else {
            blobData = new Blob([new Uint8Array(data as ArrayBuffer)]);
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", blobData, file.name);
        formData.append("name", file.name);
        formData.append("folderName", folderName);
        formData.append("size", file.size.toString());
        formData.append("currentChunkIndex", (currentChunkIndex as number).toString());
        formData.append("totalChunks", Math.ceil(file.size / chunkSize).toString());

        uploadFile(formData)
            .unwrap()
            .then((response) => {
                const fileSize: number = files[currentFileIndex as number].size;
                const chunks: number = Math.ceil(fileSize / chunkSize) - 1;
                const isLastChunk: boolean = (currentChunkIndex as number) === chunks;

                if (isLastChunk) {
                    const finalFilename: string = response.finalFilename;
                    file.finalFilename = finalFilename;
                    setLastUploadedFileIndex(currentFileIndex);
                    setCurrentChunkIndex(null);
                    getFileName(response.finalFilename);
                } else {
                    setCurrentChunkIndex((currentChunkIndex as number) + 1);
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error("File upload failed:", error);
            });
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

    return (
        <>
            {loading ? (
                <div className="page-loader">
                    <div className="page-innerLoader">
                        <div className="spinner-border" role="status">
                            <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container">
                    {!showCropper ? (
                        <div className="file-uploads">
                            <div
                                onDragOver={(e) => {
                                    setDropzoneActive(true);
                                    e.preventDefault();
                                }}
                                onDragLeave={(e) => {
                                    setDropzoneActive(false);
                                    e.preventDefault();
                                }}
                                onDrop={(e) => handleDrop(e)}
                                onClick={handleDragAreaClick}
                                className={"dropzone" + (dropzoneActive ? " active" : "")}
                            >
                                <div className="icon-logo">
                                    {folderName === "chat" ?
                                        <FontAwesomeIcon icon={faPlus} />
                                        :
                                        <img src={require("../../assets/images/upload-icone.png")} alt="" />
                                    }
                                </div>
                                {folderName === "chat" ?
                                    <label className="label-for">Upload Image</label>
                                    :
                                    folderName === "employers" ?
                                        <label className="label-for">Upload <span className="files">file PDF, Word Doc, Excel, JPG</span></label>
                                        :
                                        <label className="label-for">Drop your files here</label>
                                }
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        handleNewFile(files[0]);
                                    }
                                }}
                            />

                            {from !== 'multiform' && (
                                <div className="files">
                                    {files.map((file, fileIndex) => {
                                        let progress: number = 0;
                                        if (file.finalFilename) {
                                            progress = 100;
                                        } else {
                                            const uploading: boolean = fileIndex === currentFileIndex;
                                            const chunks: number = Math.ceil(file.size / chunkSize);
                                            if (uploading) {
                                                progress = Math.round(
                                                    ((currentChunkIndex as number) / chunks) * 100
                                                );
                                            } else {
                                                progress = 0;
                                            }
                                        }
                                        return (
                                            <div key={fileIndex} className="file">
                                                <div className="name">{file.name}</div>
                                                <div
                                                    className={"progress " + (progress === 100 ? "done" : "")}
                                                    style={{ width: progress + "%" }}
                                                >
                                                    {progress}%
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {errors && <p className="error">{errors}</p>}
                        </div>
                    ) : (
                        showCropper && imageToEdit && (
                            <ImageCropper
                                image={imageToEdit}
                                onCropComplete={handleCroppedImage}
                                onCancel={() => {
                                    setShowCropper(false);
                                    setImageToEdit(null);
                                }}
                            />
                        )
                    )}


                </div>
            )}
        </>
    );
};