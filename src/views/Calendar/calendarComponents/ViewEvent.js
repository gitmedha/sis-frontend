import React, {useState,Fragment} from 'react'
import { Formik, Form } from 'formik';
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import moment from "moment";
import DetailField from "../../../components/content/DetailField";
import {FaEdit,FaTrash} from 'react-icons/fa'

const Styled = styled.div`
  .icon-box {
    display: flex;
    padding: 5px;
    justify-content: center;
  }
  .cv-icon {
    margin-right: 20px;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 50%;

    &:hover {
      background-color: #eee;
      box-shadow: 0 0 0 1px #c4c4c4;
    }
  }
  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;


function ViewEvent(props) {

  const {onHide, event,openEditForm} = props;


  return (
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
              Event Info
              </h1>
         
          </Modal.Title>
          <div style={{display:'flex',justifyContent:'space-around'}}>
            <div style={{ cursor: 'pointer' ,marginRight:'10px'}} onClick={()=>openEditForm()}>
            <FaEdit size={25} color='#808080'/>
            </div>
            <div style={{cursor:'pointer'}}>
            <FaTrash size={22} color='red'/>
            </div>
          </div>
        </Modal.Header>
        <Styled>
          <Modal.Body className="bg-white">
            <div className="row">
              <div className="col-md-6 col-sm-12 mb-2">
                <DetailField
                  label="Assigned To"
                  value={event.assgined_to ? event.assgined_to.username : ""}
                />
              </div>
              <div className='col-md-6 col-sm-12 mb-2'>
                <DetailField label="Alumni Service" value={event.alumni_service ?event.alumni_service:""} />
              </div>
              <div className='col-md-6 col-sm-12 mb-2'>
              <DetailField label="Status" value={event.status ? event.status:""} />
              </div>
              <div className='col-md-6 col-sm-12 mb-2'>
              <DetailField label="Start Date" value={event.start_date?moment(event.start_date).format("DD MMM YYYY"):""} />
              </div>
              <div className='col-md-6 col-sm-12 mb-2'>
              <DetailField label="End Date" value={event.end_date?moment(event.end_date).format("DD MMM YYYY"):"" } />
              </div>
            </div>
          </Modal.Body>
        </Styled>
      </Modal>
  )
}

export default ViewEvent