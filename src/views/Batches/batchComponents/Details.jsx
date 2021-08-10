import NP from "nprogress";
import { useState, useEffect, useMemo } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { queryBuilder } from "../../../apis";
import { useHistory } from "react-router-dom";
import { DELETE_BATCH } from "../../../graphql";
import UpdateBatchDetails from "./UpdateDetails";
import SweetAlert from "react-bootstrap-sweetalert";
// import { Table } from "react-bootstrap";
import ProgressBar from "@ramonak/react-progress-bar";
import { Badge } from "../../../components/content/Utils";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import DetailField from "../../../components/content/DetailField";
import { getBatchesPickList } from "../batchActions";
import Table from '../../../components/content/Table';

const Details = ({ batch, done, setAlert }) => {
  const history = useHistory();
  const [showAlert, setAlertShow] = useState(false);
  const [showModal, setModalShow] = useState(false);
  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getBatchesPickList().then(data => {
      setPickList(data);
    });
  }, [])

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
      setAlert("Batch deleted successfully.", "success");
    } catch (err) {
      setAlert("Unable to delete batch.", "error");
      console.log("BATCH_DELETE_ERR", err);
    } finally {
      setAlertShow(false);
      NP.done();
      history.push("/batches");
    }
  };

  const handleModalOnHide = (status) => {
    setModalShow(false);
    if (status === "updated") {
      done();
    }
  };

  const openModal = () => {
    setModalShow(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Sessions planned',
        accessor: 'sessions_planned',
        disableSortBy: true,
      },
      {
        Header: 'Per-student fees',
        accessor: 'per_student_fees',
        disableSortBy: true,
      },
      {
        Header: 'Seats Available',
        accessor: 'seats_available',
        disableSortBy: true,
      },
    ],
    []
  );

  const batchTableData = [
    {
      sessions_planned: 20,
      per_student_fees: 400,
      seats_available: 50,
    }
  ];

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Name" value={batch.name} />
          <DetailField label="Program Name" value={batch.program?.name} />
          <DetailField label="Status" value={<Badge value={batch.status} pickList={pickList.status} />} />
          <DetailField label="Institution" value={batch.institution.name} />
          <DetailField label="Name in Current SIS" value={batch.name_in_current_sis} />
          <div className="mt-5">
            <div style={{color: '#787B96', fontFamily: 'Latto-Regular', fontSize: '14px', lineHeight: 1.2, marginBottom: '10px'}}>
              Average Attendance Across All Sessions
            </div>
            <ProgressBar
              completed={60}
              bgColor={"#5C4CBF"}
              baseBgColor={"#EEEFF8"}
            />
          </div>
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Assigned To" value={batch.assigned_to?.username} />
          <DetailField label="Area" value={"Shaheed Path"} />
          <DetailField label="Start Date" value={<Moment date={batch.start_date} format={"DD MMM YYYY"} />} />
          <DetailField label="End Date" value={<Moment date={batch.end_date} format={"DD MMM YYYY"} />} />
          <Table columns={columns} data={batchTableData} paginationPageSize={1} totalRecords={1} fetchData={() => {}} indexes={false} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-2 px-3">
      {/* <pre>
        <code>{JSON.stringify(batch, null, 2)}</code>
      </pre> */}
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
          <Badge value={batch.status} pickList={[]} />
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
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text-detail-title">Institution</p>
          <p>{batch.institution.name}</p>
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

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Details);
