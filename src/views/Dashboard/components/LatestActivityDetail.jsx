import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import DetailField from "src/components/content/DetailField";

const LatestActivityDetail = (props) => {
  const { onHide, show, data } = props;
  const history = useHistory();
  // console.log(data);
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
      <Modal.Header className="bg-white d-flex justify-content-between">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="d-flex align-items-center"
        >
          <h1 className="text--primary bebas-thick mb-0">
            Latest Activity Detail
          </h1>
        </Modal.Title>
        <div className="Go to">
          {console.log(props.data)}
          <button className="bg-light border-0 cursor-pointer" onClick={() => history.push(`/${props.data.module_name}/${props.data.event_id}`)}>
          <FaExternalLinkAlt size={25} />
          </button>
        </div>
      </Modal.Header>
      <>
        <Modal.Body className="bg-white">
          <h4 className="section-header ">Basic Info</h4>
          <div className="row  ">
            <div className="col-md-6 col-sm-12">
            <DetailField
                className=""
                Bold={""}
                label="Activity"
                value={props.data.activity}
              />
             
            </div>
            
            <div className="row">
  {Object.entries(props.data.changes_in).map(([key, value], index) => (
    <div className="col-md-6 col-sm-12" key={key}>
      <DetailField
        label={key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())} // Format label
        value={value.new_value || value} // Display new_value if present
        Bold=""
        className=""
      />
    </div>
  ))}
</div>
<div className="col-md-6 col-sm-12">

            <DetailField
                className=""
                Bold={""}
                label="Module Name"
                value={props.data.module_name}
              />
            </div>

            <div className="col-md-6 col-sm-12">
            <DetailField
                className=""
                Bold={""}
                label="Updated By"
                value={props.data?.updatedby?.username}
              />
            </div>

          </div>
        </Modal.Body>
        <div className="d-flex justify-content-center my-2">
          <button className="btn btn-danger" onClick={onHide}>
            Close
          </button>
        </div>
      </>
    </Modal>
  );
};

export default LatestActivityDetail;
