import api from "../../apis";
import { useState } from "react";
import { urlPath } from "../../constants";
import { FaFileImage } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";
import { IMAGE_UPLOADER } from "../../graphql";

const ImageUploader = ({
  handler,
  id = "file_uploader",
  label = "Upload Logo",
}) => {
  const [image, setImage] = useState(null);
  const [uploadProgress, setProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);

  const onUploadProgress = ({ loaded, total }) => {
    let progress = ((loaded / total) * 100).toFixed(2);
    setProgress(progress);
  };

  const handleChange = async (e) => {
    try {
      setUploading(true);
      let formdata = new FormData();
      const queryString = {
        query: IMAGE_UPLOADER,
        variables: {
          file: null,
        },
      };

      formdata.append("operations", JSON.stringify(queryString));
      formdata.append(
        "map",
        JSON.stringify({
          0: ["variables.file"],
        })
      );

      formdata.append("0", e.target.files[0], e.target.files[0].name);

      let { data } = await api.post("/graphql", formdata, {
        onUploadProgress,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await setImage(urlPath(data.data.upload.url.substring(1)));

      handler({
        id: Number(data.data.upload.id),
        path: urlPath(data.data.upload.url.substring(1)),
      });
    } catch (err) {
      console.log("UPLOAD_ERR", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!isUploading && !image && (
        <div className="uploader-container">
          <div className="imageUploader">
            <p className="upload-helper-text">Click Here To Uplaod Image</p>
            <div className="upload-helper-icon">
              <FaFileImage size={30} color={"#257b69"} />
            </div>
            <input
              id={id}
              type="file"
              multiple={false}
              name="file-uploader"
              onChange={handleChange}
              className="uploaderInput"
            />
          </div>
          <label htmlFor={id} className="text--primary latto-bold text-center">
            {label}
          </label>
        </div>
      )}
      {isUploading && !image && (
        <ProgressBar variant="success" now={uploadProgress} />
      )}
      {image && <img src={image} className="uploaded-img" />}
    </div>
  );
};

export default ImageUploader;
