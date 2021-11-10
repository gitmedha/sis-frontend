import api from "../../apis";
import { useState } from "react";
import { urlPath } from "../../constants";
import { FaFileImage } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";
import { IMAGE_UPLOADER } from "../../graphql";

const CvUploader = ({
  handler,
  id = "file_uploader",
  label = "Upload Cv",
  initialValue = {},
}) => {
  const [cvUrl, setCvUrl] = useState(initialValue.url ? urlPath(initialValue.url.substring(1)) : null);
  const [cvId, setCvId] = useState(initialValue.id || null);
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
      console.log( e.target.files[0].name)
    
      let { data } = await api.post("/graphql", formdata, {
        onUploadProgress,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(data)

      await setCvUrl(urlPath(data.data.upload.url.substring(0)));
      await setCvId(Number(data.data.upload.id));

      handler({
        id: cvId || Number(data.data.upload.id),
        path: cvUrl || urlPath(data.data.upload.url.substring(1)),
      });
    } catch (err) {
      console.log("UPLOAD_ERR", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!isUploading && !cvUrl && (
        <div className="uploader-container">
          <div className="imageUploader">
            <p className="upload-helper-text">Click Here To Upload Cv</p>
            <div className="upload-helper-icon">
              <FaFileImage size={30} color={"#257b69"} />
            </div>
            <input
              id={id}
              accept=".pdf, .docx" 
              type="file"
              multiple={false}
              name="file-uploader"
              onChange={handleChange}
              className="uploaderInput"
            />
          </div>
          <label  className="text--primary latto-bold text-center">
            {label}
          </label>
        </div>
      )}
      {isUploading && !cvUrl && (
        <ProgressBar variant="success" now={uploadProgress} />
      )}
      {cvUrl && (
        <fileUrl src={cvUrl} className="uploaded-img" alt={"uploaded-pic"} />
      )}
    </div>
  );
};

export default CvUploader;
