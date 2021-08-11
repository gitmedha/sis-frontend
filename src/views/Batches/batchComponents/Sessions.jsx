import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { useState, useMemo } from "react";
import styled from "styled-components";

import Table from '../../../components/content/Table';
import { ProgressBarField, TableRowDetailLink } from "../../../components/content/Utils";
import AddBatchSessionForm from "./AddBatchSessionForm";

const SessionLink = styled.div`
  @media screen and (min-width: 768px) {
    margin-left: 30px;
  }
`

const Sessions = ({ sessions, batchID }) => {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);

  const columns = useMemo(
    () => [
      {
        Header: 'Topics covered',
        accessor: 'topics_covered',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Attendance',
        accessor: 'attendance',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const sessionTableData = sessions.map(session => {
    return {
      id: session.id,
      topics_covered: session.topics_covered,
      date: moment(session.date).format('DD MMM YYYY'),
      attendance: <ProgressBarField value={session.percent} />,
      link: <SessionLink><TableRowDetailLink value={session.id} to={'session'} /></SessionLink>
    }
  });

  const handleRowClick = session => {
    history.push(`/sesssion/${session.id}`)
  }

  const hideCreateModal = async (data) => {
    // if (!data || data.isTrusted) {
    //   setModalShow(false);
    //   return;
    // }

    // // need to remove `show` from the payload
    // let {show, ...dataToSave} = data;
    // dataToSave['start_date'] = moment(data.start_date).format("YYYY-MM-DD");
    // dataToSave['end_date'] = moment(data.end_date).format("YYYY-MM-DD");

    // NP.start();
    // createBatch(dataToSave).then(data => {
    //   setAlert("Batch created successfully.", "success");
    // }).catch(err => {
    //   console.log("CREATE_DETAILS_ERR", err);
    //   setAlert("Unable to create batch.", "error");
    // }).finally(() => {
    //   NP.done();
    //   getBatches();
    // });
    // setModalShow(false);
  };

  return (
    <div className="py-2 px-3">
      <div className="row">
        <div className="col-md-6 col-sm-12"></div>
        <div className="col-md-6 col-sm-12 d-flex justify-content-end">
          {/* <Link
            to={`/new-session/${batchID}`}
            className="btn btn regular btn-primary"
          >
            Add Session & Attendance
          </Link> */}
          <button
            className="btn btn-primary"
            onClick={() => setModalShow(true)}
          >
            Add Session & Attendance
          </button>
        </div>
        <div className="col-12 mt-3">
          <Table columns={columns} data={sessionTableData} paginationPageSize={sessionTableData.length} totalRecords={sessionTableData.length} fetchData={() => {}} onRowClick={handleRowClick} />
        </div>
      </div>
      <AddBatchSessionForm
        show={modalShow}
        onHide={hideCreateModal}
        batchId={batchID}
      />
    </div>
  );
};

export default Sessions;
