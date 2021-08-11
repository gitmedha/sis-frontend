import moment from "moment";
import { Link, useHistory } from "react-router-dom";
import { useMemo } from "react";
import styled from "styled-components";

import Table from '../../../components/content/Table';
import { ProgressBarField, TableRowDetailLink } from "../../../components/content/Utils";

const SessionLink = styled.div`
  @media screen and (min-width: 768px) {
    margin-left: 30px;
  }
`

const Sessions = ({ sessions, batchID }) => {
  const history = useHistory();

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

  return (
    <div className="py-2 px-3">
      <div className="row">
        <div className="col-md-6 col-sm-12"></div>
        <div className="col-md-6 col-sm-12 d-flex justify-content-end">
          <Link
            to={`/new-session/${batchID}`}
            className="btn btn regular btn-primary"
          >
            Add Session & Attendance
          </Link>
        </div>
        <div className="col-12 mt-3">
          <Table columns={columns} data={sessionTableData} paginationPageSize={sessionTableData.length} totalRecords={sessionTableData.length} fetchData={() => {}} onRowClick={handleRowClick} />
        </div>
      </div>
    </div>
  );
};

export default Sessions;
