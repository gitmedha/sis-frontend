import api from "../../apis";
import Tooltip from "./Tooltip";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { urlPath } from "../../constants";
import CvUploader from "./CvUploader";

import { connect } from "react-redux";
import { setAlert } from "../../store/reducers/Notifications/actions";

    const mapStateToProps = (state) => ({});
    const mapActionsToProps = {
      setAlert,
    };
    
    export const CvWith = connect(
      mapStateToProps,
      mapActionsToProps
    )(({ Cv, title, done, query, id, setAlert }) => {
      const [modalShow, setModalShow] = useState(false);
    
      const modalCloseHandler = async (CvId) => {
        try {
          if (typeof CvId === "object" || CvId === undefined) {
            setModalShow(false);
            return;
          }
    
          await api.post("/graphql", {
            query,
            variables: {
              data: { logo: CvId },
              id,
            },
          });
          setAlert("CV updated successfully.", "success");
          setModalShow(false);
          done();
        } catch (err) {
          setAlert("Unable to update the CV.", "error");
        }
      };
    
      return (
        <div className="d-flex align-items-center justify-content-start mb-2">
          {!Cv && (
            <Tooltip title="Click Here to Upload Cv">
              <div
                // style={{ cursor: "pointer" }}
                onClick={() => setModalShow(true)}
                // className="flex-row-centered avatar avatar-default"
              >
                <button
                //   onClick={CvWith}
                className="btn btn-secondary btn-cv-upload mx-1">
                  Upload Cv
                </button>
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
      const [cvId, setCv] = useState(null);
      const handler = (data) => setCv(data.id);
      const updateCv = () => onHide(cvId);
    
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
              Update Cv
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <div
              style={{ width: "100%", height: "200px" }}
              className="flex-row-centered"
            >
              <CvUploader handler={handler} />
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <button className="btn btn-secondary btn-regular" onClick={onHide}>
              CANCEL
            </button>
            <button className="btn btn-primary btn-regular" onClick={updateCv}>
              Change Cv
            </button>
          </Modal.Footer>
        </Modal>
      );
      };

export default CvWith;