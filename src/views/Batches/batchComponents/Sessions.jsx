import moment from "moment";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { cellStyle, TableLink } from "../../../components/content/AgGridUtils";

const Sessions = ({ sessions }) => {
  return (
    <div className="py-2 px-3">
      <div className="row">
        <div className="col-12">
          <div
            className="ag-theme-alpine"
            style={{ height: "50vh", width: "100%" }}
          >
            <AgGridReact
              rowData={sessions}
              frameworkComponents={{
                link: TableLink,
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
                cellStyle={cellStyle}
              />
              <AgGridColumn
                sortable
                field="attendance"
                cellStyle={cellStyle}
                headerName="Attendance"
              />
              <AgGridColumn
                field="id"
                width={70}
                headerName=""
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
