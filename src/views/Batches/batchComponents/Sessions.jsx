import moment from "moment";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import Table from '../../../components/content/Table';
import ProgressBar from "@ramonak/react-progress-bar";
import { TableRowDetailLink } from "../../../components/content/Utils";

const Sessions = ({ sessions, batchID }) => {
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
      topics_covered: session.topics_covered,
      date: moment(session.date).format('DD MMM YYYY'),
      attendance: <ProgressBar completed={session.percent} bgColor={"#5C4CBF"} baseBgColor={"#EEEFF8"} />,
      link: <TableRowDetailLink value={session.id} to={'session'} />
    }
  });

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
          <Table columns={columns} data={sessionTableData} paginationPageSize={sessionTableData.length} totalRecords={sessionTableData.length} fetchData={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Sessions;
