import { AgGridColumn, AgGridReact } from "ag-grid-react";
import {
  cellStyle,
  SerialNumberRenderer,
} from "../../../components/content/AgGridUtils";

const SessionStudentList = ({ students, loading }) => {
  return (
    <div className="row">
      <div className="col-md-6 col-sm-12">
        <div
          className="ag-theme-alpine"
          style={{ height: "50vh", width: "100%" }}
        >
          <AgGridReact
            rowData={students}
            frameworkComponents={{
              sno: SerialNumberRenderer,
            }}
          >
            <AgGridColumn
              sortable
              field="name"
              cellRenderer="sno"
              headerName="S. No."
              cellStyle={cellStyle}
            />
            <AgGridColumn
              sortable
              field="name"
              headerName="Name"
              cellStyle={cellStyle}
            />
          </AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default SessionStudentList;
