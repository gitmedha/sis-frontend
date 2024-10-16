import React from 'react';
import { Modal } from "react-bootstrap";

const LatestActivityDetail=(props)=> {
  const {onHide,show,data}=props
  return (
    <Modal
    centered
    size="xl"
    show={show}
    onHide={onHide}
    animation={false}
    aria-labelledby="contained-modal-title-vcenter"
    className="form-modal"
  >
    <Modal.Header className="bg-white">
      {console.log(data)}
      <Modal.Title
        id="contained-modal-title-vcenter"
        className="d-flex align-items-center"
      >
        <h1 className="text--primary bebas-thick mb-0">Latest Activity Detail</h1>
      </Modal.Title>
    </Modal.Header>
    <>
      <Modal.Body className="bg-white">
        <h4 className="section-header ">Basic Info</h4>
        <div className="row  ">
          {/* <div className="col-md-6 col-sm-12">
            <DetailField
              className=""
              Bold={""}
              label="Mentor Name"
              value={props.mentor_name}
            />
            <DetailField
              className=""
              Bold={""}
              label="Program Name"
              value={props.program_name}
            />
            <DetailField
              className=""
              Bold={""}
              label="Contact"
              value={props.contact}
            />
            <DetailField
              className=""
              Bold={""}
              label="Outreach (Offline/Online)"
              value={props.outreach}
            />
            <DetailField
              className=""
              Bold={""}
              label="Onboarding Date"
              value={
                moment(props.outreach).format("DD MMM YYYY")
                  ? moment(props.start_date).format("DD MMM YYYY")
                  : ""
              }
            />
            <DetailField
              className=""
              Bold={""}
              label="Email"
              value={props.email}
            />
            <DetailField
              className=""
              Bold={""}
              label="Mentor's Company Name"
              value={props.mentor_company_name}
            />
           
          </div> */}

          <p>This is the latest actvity detail page</p>

        </div>
       
      </Modal.Body>
     <div className='d-flex justify-content-center my-2'>
      <button className='btn btn-danger' onClick={onHide}>Close</button>
     </div>
    </>
  </Modal>
  )
}

export default LatestActivityDetail;
