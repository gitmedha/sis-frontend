import api from "../../apis";
import Tooltip from "./Tooltip";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import FileUploader from "./FileUploader";
import { FaUpload } from "react-icons/fa";

import { connect } from "react-redux";
import { setAlert } from "../../store/reducers/Notifications/actions";

    const mapStateToProps = (state) => ({});
    const mapActionsToProps = {
      setAlert,
    };

    export const CvUpload = connect(
      mapStateToProps,
      mapActionsToProps
    )(({ CV, title, done, query, id, setAlert }) => {
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
              data: { CV: CvId },
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
        <div className="justify-content-start">
          {!CV && (
            <Tooltip placement="top" title="Click Here to Upload CV">
            <div className="menu_links" onClick={() => setModalShow(true)}> <FaUpload size="27" color='207B69' /> </div>
            </Tooltip>
          )}

          <h1 className="bebas-thick text--primary align-self-center m-0">
            {title}
          </h1>
          <CvModal show={modalShow} onHide={modalCloseHandler} />
        </div>
      );
    });

    const CvModal = (props) => {
      let { onHide } = props;
      const [cvId, setFile] = useState(null);
      const handler = (data) => setFile(data.id);
      const updateFile = () => onHide(cvId);

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
              Update CV
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            <div
              style={{ width: "100%", height: "200px" }}
              className="flex-row-centered"
            >
              <FileUploader handler={handler} />
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <button className="btn btn-secondary btn-regular" onClick={onHide}>
              CANCEL
            </button>
            <button className="btn btn-primary btn-regular" onClick={updateFile}>
              Save
            </button>
          </Modal.Footer>
        </Modal>
      );
      };

export default CvUpload;
