import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import moment from "moment";
import DetailField from '../../../components/content/DetailField';
import { Badge } from "../../../components/content/Utils";
import { getEmploymentConnectionsPickList } from "./StudentActions";

const EmploymentConnection = (props) => {
  let { onHide, show, handleEdit, handleDelete, student, employmentConnection } = props;
  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getEmploymentConnectionsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  return (
      <Modal
        centered
        size="lg"
        show={show}
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
        <Modal.Body className="bg-white">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <DetailField label="Student" value={`${student.first_name} ${student.last_name}`} />
              <DetailField label="Opportunity" value={employmentConnection.opportunity ? employmentConnection.opportunity.employer.name : ''} />
              <DetailField label="Status" value={<Badge value={employmentConnection.status} pickList={pickList.status} />} />
              <DetailField label="Type" value={employmentConnection.type} />
            </div>
            <div className="col-md-6 col-sm-12">
              <DetailField label="Start Date" value={employmentConnection.start_date ? moment(employmentConnection.start_date).format("DD MMM YYYY") : ''} />
              <DetailField label="End Date" value={employmentConnection.end_date ? moment(employmentConnection.end_date).format("DD MMM YYYY") : ''} />
              <DetailField label="Rejection reason" value={employmentConnection.reason_if_rejected} />
              <DetailField label="Salary range" value={employmentConnection.salary_in_inr} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="button" className="btn btn-primary px-4 mx-4" onClick={handleEdit}>EDIT</button>
              <button type="button" className="btn btn-danger px-4 mx-4" onClick={handleDelete}>DELETE</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
  );
};

export default EmploymentConnection;
