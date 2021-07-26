import api from "../../apis";
import Tooltip from "./Tooltip";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { urlPath } from "../../constants";
import { FaSchool } from "react-icons/fa";
import ImageUploader from "./ImageUploader";

import { connect } from "react-redux";
import { setAlert } from "../../store/reducers/Notifications/actions";

const Avatar = ({ logo, name, style }) => {
  return (
    <div className="d-flex align-items-center justify-content-start h-100">
      {logo ? (
        <img
          className={"avatar img-fluid"}
          src={urlPath(logo.url)}
          alt={`${name}-logo`}
          style={style}
        />
      ) : (
        <div className="flex-row-centered avatar avatar-default">
          <FaSchool size={25} style={style} />
        </div>
      )}

      <p className="mb-0 latto-regular" style={{ color: '#787B96'}}>{name}</p>
    </div>
  );
};

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export const TitleWithLogo = connect(
  mapStateToProps,
  mapActionsToProps
)(({ logo, title, done, query, id, setAlert }) => {
  const [modalShow, setModalShow] = useState(false);

  const modalCloseHandler = async (logoId) => {
    try {
      if (typeof logoId === "object" || logoId === undefined) {
        setModalShow(false);
        return;
      }

      await api.post("/graphql", {
        query,
        variables: {
          data: { logo: logoId },
          id,
        },
      });
      setAlert("Logo updated successfully.", "success");
      setModalShow(false);
      done();
    } catch (err) {
      setAlert("Unable to update the logo.", "error");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-start mb-2">
      {logo && (
        <Tooltip title="Click Here to change logo">
          <img
            alt={`${title}-logo`}
            src={urlPath(logo.url)}
            style={{ cursor: "pointer" }}
            className={"avatar img-fluid"}
            onClick={() => setModalShow(true)}
          />
        </Tooltip>
      )}

      {!logo && (
        <Tooltip title="Click Here to change logo">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setModalShow(true)}
            className="flex-row-centered avatar avatar-default"
          >
            <FaSchool size={25} />
          </div>
        </Tooltip>
      )}

      <h1 className="bebas-thick text--primary mr-3 align-self-center mt-2">
        {title}
      </h1>
      <ChangeAvatarModal show={modalShow} onHide={modalCloseHandler} />
    </div>
  );
});

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
      animation={false}
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
        <div
          style={{ width: "100%", height: "200px" }}
          className="flex-row-centered"
        >
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
