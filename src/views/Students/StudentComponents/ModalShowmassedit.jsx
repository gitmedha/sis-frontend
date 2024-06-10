import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import api from "../../../apis";
import { connect } from "react-redux";
import MassEdit from "./MassEdit";
import MassEmployerUpload from "./MassEmployerUpload";

const Styled = styled.div`
  .cont {
    position: absolute;
    right: 0;
    top:10px;
  }
  .cross {
    border: none;
    background: none;
  }
`;

const ModalShowmassedit = (props) => {
  let { onHide, show } = props;
  const [modalShow1, setModalShow1] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);

  const handleMassAlumuni = (data) => {
    setModalShow1(!modalShow1);
    onHide();
  };

  const HideMassEmployeCreateModal = async (data) => {
    if (data.length == 0) {
      // return ;
      setAlert("Unable to create Employment Connection Data.", "error");
    } else {
      try {
        const response = await api.post(
          "/employment-connections/createBulkEmploymentConnection",
          data
        );
        setAlert("Employment Connection data created successfully.", "error");
      } catch (error) {
        setAlert("Unable to create Employment Connection Data.", "error");
      }
    }
  };

  const hideMassCreateModal = async (data) => {
    if (data.length == 0) {
      setAlert("Unable to create Alumni Data.", "error");
    } else {
      try {
        const response = await api.post(
          "/alumni-services/createBulkAlumniServices",
          data
        );
        setAlert("Alumni data created successfully.", "success");
      } catch (error) {
        setAlert("Unable to create Alumni Data.", "error");
      }
    }
  };
  const handleMassemployer = () => {
    setModalShow2(!modalShow2);
    onHide();
  };

  const uploadData = (data) => {
    props.uploadData(data);
    handleMassemployer();
  };

  const uploadAlumniData = (data) => {
    props.uploadAlumniData(data);
  };

  const handelSubmit = (data, key) => {
    props.handelSubmitMassEdit(data, key);
  };

  return (
    <div>
      <Modal
        centered
        size="lg"
        show={show}
        onHide={onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
      >
        <Modal.Header
          id="example-custom-modal-styling-title"
          className="bg-white"
        >
          <Modal.Title id="contained-modal-title-vcenter" className="d-flex ">
            <Styled>
              <div className="row justify-content-between align-items-center">
                <div className="col-auto">
                  <h1 className="text--primary bebas-thick mb-0">
                    Please select one option
                  </h1>
                </div>

                <div className="col-auto cont">
                  <button onClick={onHide} className="cross">
                    <FaTimes />
                  </button>
                </div>
              </div>
            </Styled>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white">
          <div className="d-flex justify-content-around align-items-center ">
            <button
              type="button"
              onClick={handleMassAlumuni}
              className="btn btn-primary mass_edit_bottons"
            >
              Alumni Edit
            </button>
            <button
              type="button"
              onClick={handleMassemployer}
              className="btn btn-primary mass_edit_bottons"
            >
              Employer Edit
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <MassEdit
        data={props.data}
        show={modalShow1}
        onHide={handleMassAlumuni}
        uploadData={hideMassCreateModal}
        uploadAlumniData={uploadAlumniData}
        handelSubmit={handelSubmit}
      />
      <MassEmployerUpload
        data={props.data}
        show={modalShow2}
        onHide={handleMassemployer}
        uploadData={uploadData}
        handelSubmitMassEdit={handelSubmit}
        // onHide={HideMassEmployeCreateModal}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(ModalShowmassedit);
