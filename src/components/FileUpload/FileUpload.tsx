import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FileUpload.scss";
import { getUserData } from "../../utils/Utils";
import { useUploadFileMutation } from "./FileUploadApiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const chunkSize: number = 5 * 1024 * 1024;

interface CustomFile extends File {
  finalFilename?: string;
}
interface ProfileProps {
  getFileName?: (name: string | null) => void;
  folderName: string;
  from?: string;
}

export const FileUpload: React.FC<ProfileProps> = ({
  getFileName = () => { },
  folderName,
  from,
}) => {
  const [uploadFile] = useUploadFileMutation();
  const [dropzoneActive, setDropzoneActive] = useState<boolean>(false);
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<
    number | null
  >(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    setLoading(true);
    e.preventDefault();
    const newFiles: File[] = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
    setDropzoneActive(false); // Ensure dropzone is deactivated after dropping files
  }

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
    setLoading(true);
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
        } else {
          setCurrentChunkIndex((currentChunkIndex as number) + 1);
        }
        getFileName(response.finalFilename);
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
                const newFiles: File[] = Array.from(e.target.files || []);
                if (
                  folderName === "profile-images" || folderName === "employers" || folderName === "job-images") {
                  if (

                    (newFiles[0].type === "image/png" ||
                      newFiles[0].type === "image/jpg" ||
                      newFiles[0].type === "image/jpeg" ||
                      newFiles[0].type === "image/gif")
                  ) {
                    setError("");
                    setFiles([...files, ...newFiles]);
                  } else
                    setError("Invalid file format. Recommended:JPG, PNG, or GIF");
                }
              }}
            />
            {from !== 'multiform' ? (
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
            ) : ""}
            {errors && <p className="error">{errors}</p>}
            {/* <button
          onClick={handleManualUpload}
          className="button-style upload-btn"
        >
          Upload
        </button> */}
          </div>
        </div>
      )}
    </>
  );
};

// export default FileUpload;
