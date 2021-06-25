import moment from "moment";
import { Link } from "react-router-dom";
import {
  cellStyle,
  TableLink,
  BadgeRenderer,
  ProgressRenderer,
} from "../../../components/content/AgGridUtils";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

const Sessions = ({ sessions, batchID }) => {
  return (
    <div className="py-2 px-3">
      <div className="row">
        <div className="col-md-6 col-sm-12">
          {/* Filter and Sorting goes here */}
        </div>
        <div className="col-md-6 col-sm-12 d-flex justify-content-end">
          <Link
            to={`/new-session/${batchID}`}
            className="btn btn regular btn-primary"
          >
            Add Session & Attendance
          </Link>
        </div>
        <div className="col-12 mt-3">
          <div
            className="ag-theme-alpine"
            style={{ height: "50vh", width: "100%" }}
          >
            <AgGridReact
              rowData={sessions}
              rowHeight={70}
              frameworkComponents={{
                link: TableLink,
                badge: BadgeRenderer,
                progress: ProgressRenderer,
              }}
            >
              <AgGridColumn
                sortable
                field="session_number"
                cellStyle={cellStyle}
                headerName="Session No."
              />
              <AgGridColumn
                sortable
                cellStyle={cellStyle}
                field="topics_covered"
                headerName="Topics Covered"
              />
              <AgGridColumn
                sortable
                width={210}
                field="date"
                headerName="Date"
                cellStyle={cellStyle}
                cellRenderer={({ value }) =>
                  moment(value).format("DD MMM YYYY")
                }
              />
              <AgGridColumn
                sortable
                field="status"
                headerName="Status"
                cellRenderer="badge"
                cellStyle={cellStyle}
              />
              <AgGridColumn
                sortable
                width={300}
                field="attendance"
                cellRenderer="progress"
                headerName="Attendance"
              />
              <AgGridColumn
                field="id"
                width={70}
                cellRenderer="link"
                cellRendererParams={{ to: "session" }}
              />
            </AgGridReact>
          </div>
        </div>
      </div>
      {/* <pre>
        <code>{JSON.stringify(sessions, null, 2)}</code>
      </pre> */}
    </div>
  );
};

export default Sessions;
