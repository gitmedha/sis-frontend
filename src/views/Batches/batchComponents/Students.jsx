import moment from "moment";
import {
  cellStyle,
  BadgeRenderer,
  ProgressRenderer,
  SerialNumberRenderer,
  StudentDetailsRenderer,
} from "../../../components/content/AgGridUtils";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

const Students = ({ students }) => {
  return (
    <div className="px-3 py-2">
      {/* <pre>
        <code>{JSON.stringify(students, null, 2)}</code>
      </pre> */}
      <div className="row">
        <div className="col-12">
          <div
            className="ag-theme-alpine"
            style={{ height: "50vh", width: "100%" }}
          >
            <AgGridReact
              rowHeight={70}
              rowData={students}
              frameworkComponents={{
                badge: BadgeRenderer,
                sno: SerialNumberRenderer,
                progress: ProgressRenderer,
                studentDetails: StudentDetailsRenderer,
              }}
            >
              <AgGridColumn
                sortable
                width={90}
                headerName="#"
                cellRenderer="sno"
                cellStyle={cellStyle}
                field="student.first_name"
              />
              <AgGridColumn
                sortable
                cellStyle={cellStyle}
                headerName="Student Name"
                field="student.first_name"
                cellRenderer={(props) => {
                  return `${props.value} ${props.data.student.last_name}`;
                }}
              />
              <AgGridColumn
                sortable
                headerName="Phone"
                cellStyle={cellStyle}
                field="student.phone"
              />
              <AgGridColumn
                sortable
                field="status"
                cellRenderer="badge"
                cellStyle={cellStyle}
                headerName="Enrollment Status"
              />
              <AgGridColumn
                sortable
                width={300}
                field="attendance"
                cellRenderer="progress"
                headerName="Attendance"
              />
              <AgGridColumn
                sortable
                width={70}
                field="id"
                headerName=""
                cellRenderer="studentDetails"
              />
            </AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
