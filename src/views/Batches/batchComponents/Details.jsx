import NP from "nprogress";
import { useState } from "react";
import Moment from "react-moment";
import { queryBuilder } from "../../../apis";
import { useHistory } from "react-router-dom";
import { DELETE_BATCH } from "../../../graphql";
import SweetAlert from "react-bootstrap-sweetalert";
import Table from "../../../components/content/Table";
import ProgressBar from "@ramonak/react-progress-bar";
import { BadgeRenderer } from "../../../components/content/AgGridUtils";
import UpdateBatchDetails from "./UpdateDetails";

const Details = ({ batch }) => {
  const history = useHistory();
  const [showAlert, setAlertShow] = useState(false);
  const [showModal, setModalShow] = useState(false);

  const handleDelete = async () => {
    NP.start();
    try {
      let data = await queryBuilder({
        query: DELETE_BATCH,
        variables: {
          batch: batch.id,
        },
      });
      console.log("BATCH_DELETED", data);
    } catch (err) {
      console.log("BATCH_DELETE_ERR", err);
    } finally {
      setAlertShow(false);
      NP.done();
      history.push("/batches");
    }
  };

  const handleModalOnHide = () => {
    setModalShow(false);
  };

  const openModal = () => {
    setModalShow(true);
  };

  return (
    <div className="py-2 px-3">
      <pre>
        <code>{JSON.stringify(batch, null, 2)}</code>
      </pre>
      <div className="row">
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Batch Name</p>
          <p>{batch.name}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Assigned To</p>
          <p>{batch.assigned_to?.username}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Program</p>
          <p>{batch.program?.name}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Area</p>
          <p>{"Shaheed Path"}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Status</p>
          <BadgeRenderer value={batch.status} />
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Start Date</p>
          <p>
            <Moment date={batch.start_date} format={"DD-MMM-YYYY"} />
          </p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">End Date</p>
          <p>
            <Moment date={batch.end_date} format={"DD-MMM-YYYY"} />
          </p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Name in Current SIS</p>
          <p>{batch.name_in_current_sis}</p>
        </div>
        <div className="col-md-6 col-sm-12 mb-3">
          <Table>
            <thead>
              <tr>
                <th scope="col">Sessions Planned</th>
                <th scope="col">Per-student fees</th>
                <th scope="col">Seats Available</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{batch.number_of_sessions_planned}</td>
                <td>{batch.per_student_fees}</td>
                <td>50</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="col-md-6 col-sm-12 mb-3 pr-4">
          <p className="text--primary latto-bold pb-3 mb-0">
            Average Attendance Across All Sessions
          </p>
          <ProgressBar
            completed={60}
            bgColor={"#5C4CBF"}
            baseBgColor={"#EEEFF8"}
          />
        </div>
        <div className="col-12">
          <button
            onClick={openModal}
            className="btn--primary"
            style={{ marginLeft: "0px" }}
          >
            EDIT
          </button>
          <button onClick={() => setAlertShow(true)} className="btn--primary">
            DELETE
          </button>
          <button className="btn--secondary">MARK AS COMPLETE</button>
        </div>
      </div>
      <UpdateBatchDetails
        batch={batch}
        show={showModal}
        onHide={handleModalOnHide}
      />
      <SweetAlert
        warning
        showCancel
        btnSize="md"
        show={showAlert}
        onConfirm={() => handleDelete()}
        onCancel={() => setAlertShow(false)}
        title={
          <span className="text--primary latto-bold">Delete this batch</span>
        }
        customButtons={
          <>
            <button
              onClick={() => setAlertShow(false)}
              className="btn--secondary"
            >
              Cancel
            </button>
            <button onClick={() => handleDelete()} className="btn--primary">
              Okay
            </button>
          </>
        }
      >
        <div>
          <p>Are you sure, You want to delete this batch?</p>
        </div>
      </SweetAlert>
    </div>
  );
};

export default Details;
