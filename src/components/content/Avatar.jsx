import { useState } from "react";
import { Modal } from "react-bootstrap";
import { urlPath } from "../../constants";
import { FaSchool } from "react-icons/fa";
import ImageUploader from "./ImageUploader";

const Avatar = ({ logo, name }) => {
  return (
    <div className="d-flex align-items-center justify-content-start">
      {logo ? (
        <img
          className={"avatar img-fluid"}
          src={urlPath(logo.url)}
          alt={`${name}-logo`}
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center avatar avatar-default">
          <FaSchool size={25} />
        </div>
      )}
      <p className="mt-3">{name}</p>
    </div>
  );
};

export const TitleWithLogo = ({ logo, title, done }) => {
  const [modalShow, setModalShow] = useState(false);

  const modalCloseHandler = (data) => {
    if (data.isTrusted) {
      setModalShow(false);
      return;
    }
    setModalShow(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-start mb-2">
      {logo && (
        <img
          alt={`${title}-logo`}
          src={urlPath(logo.url)}
          style={{ cursor: "pointer" }}
          className={"avatar img-fluid"}
          onClick={() => setModalShow(true)}
        />
      )}

      {!logo && (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setModalShow(true)}
          className="d-flex justify-content-center align-items-center avatar avatar-default"
        >
          <FaSchool size={25} />
        </div>
      )}

      <h1 className="bebas-thick text--primary mr-3 align-self-center mt-2">
        {title}
      </h1>
      <ChangeAvatarModal show={modalShow} onHide={modalCloseHandler} />
    </div>
  );
};

const ChangeAvatarModal = (props) => {
  let { onHide } = props;
  const [imageId, setImage] = useState(null);
  const handler = (data) => setImage(data.id);
  const updateImage = () => onHide(imageId);

  return (
    <Modal
      centered
      size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Update Logo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <div className="d-flex justify-content-center align-items-center">
          <ImageUploader handler={handler} />
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <button className="btn btn-secondary btn-regular" onClick={onHide}>
          CANCEL
        </button>
        <button className="btn btn-primary btn-regular" onClick={updateImage}>
          Change Logo
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default Avatar;
