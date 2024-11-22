import moment from "moment";
import React from "react";
import { Modal } from "react-bootstrap";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import DetailField from "src/components/content/DetailField";

const LatestActivityDetail = (props) => {
  const { onHide, show, data } = props;
  const history = useHistory();
  console.log(props.data);
  console.log(props.data);
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
       
      </Modal.Header>
      <>
      <Modal.Body className="bg-white">
  <div className="row">
  <div className="col-md-6 col-sm-12">
  <DetailField
    className={`text-capitalize ${props.data.activity === "Delete" ? ' ' : ''}`}
    Bold=""
    label="Activity"
    value={props.data.activity}
  />
</div>
    <div className="col-md-6 col-sm-12">
      <DetailField
        className=" text-capitalize "
        Bold
        label="Module Name"
        value={props.data.module_name}
      />
    </div>
  </div>

 

  {/* Next row starts here to align properly after changes */}
  <div className="row">
    <div className="col-md-6 col-sm-12">
      <DetailField
        className=""
        Bold=""
        label="Updated By"
        value={props.data?.updatedby?.username}
      />
    </div>
    <div className="col-md-6 col-sm-12">
      <DetailField
        className=""
        Bold=""
        label="Updated At"
        value={moment(props.data?.updated_at).format('YYYY-MM-DD') || "N/A" }
      />
    </div>
  </div>

  <div className="row">
    {props.data.activity.includes("Create")|| props.data.activity.includes("Delete") ?(
      <div className="col-md-6 col-sm-12 text-capitalize">
        <DetailField
          label="Name"
          value={props.data?.changes_in?.name}
          Bold=""
          className=""
        />
      </div>
    ) : (
      Object.entries(props.data.changes_in).map(([key, value], index) => (
        <div className="col-md-6 col-sm-12" key={key}>
          <DetailField
            label={
              "Previous " +
              key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c)
            }
            value={value?.previous_value || "No data"}
            Bold=""
            className="text-capitalize "
          />
        </div>
      ))
    ) }
  </div>
</Modal.Body>

        <div className="d-flex justify-content-center my-3">
          <button className="btn  btn-danger cursor-pointer text-decor  " onClick={onHide}>
            Close{" "}
          </button>
          <div className="Go to mx-4">
            {props.data.activity !=="Delete" ? <button
            className="btn btn-primary cursor-pointer"
            onClick={() =>
              history.push(`/${props.data.module_name}${props.data.event_id ? "/"+props.data.event_id :''}`)
            }
          >
            Check{" "}
            {/* <FaExternalLinkAlt size={15} /> */}
          </button> :''}
          
        </div>
        </div>
      </>
    </Modal>
  );
};

export default LatestActivityDetail;
