import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from '../../../components/content/DetailField';
import { Anchor, Badge } from "../../../components/content/Utils";
import CertificateUpload from "../../../components/content/Certificate";
import Tooltip from "../../../components/content/Tooltip";
import { urlPath } from "../../../constants";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { getEmploymentConnectionsPickList, getOpportunitiesPickList } from "./StudentActions";
import { UPDATE_EMPLOYMENT_CONNECTION } from "../../../graphql";
import styled from "styled-components";
import { isAdmin, isSRM } from "../../../common/commonFunctions";


const Styled = styled.div`
.icon-box{
  display:flex;
  padding: 5px;
  justify-content: center;
}
.cv-icon {
  margin-right: 20px;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 50%;

  &:hover {
    background-color: #EEE;
    box-shadow: 0 0 0 1px #C4C4C4;
  }
}
`;

const Opsdatafeilds = (props) => {
    useEffect(()=>{
        console.log(props)
    },[])
    const onHide=()=>{

    }
  return (
    <>
      <Modal
        centered
        size="lg"
        show={true}
        onHide={onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        className="form-modal"
      >
        <Modal.Header className="bg-white">
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="d-flex align-items-center"
          >
            <h1 className="text--primary bebas-thick mb-0">
              Employment Connection Details
            </h1>
          </Modal.Title>
        </Modal.Header>
        <Styled>
        <Modal.Body className="bg-white">
          <h1>hello</h1>
          {(isAdmin()) && <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn btn-primary px-4 mx-4">EDIT</button>
              <button type="button" className="btn btn-danger px-4 mx-4">DELETE</button>
            </div>
          </div>}
        </Modal.Body>
        </Styled>
      </Modal>
    </>
  )
}

export default Opsdatafeilds
