import api from "../../../apis";
import { useState } from "react";
import {
  cellStyle,
  SerialNumberRenderer,
} from "../../../components/content/AgGridUtils";
import { MARK_ATTENDANCE } from "../../../graphql";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

const SessionStudentList = ({ students, session }) => {
  const [gridApi, setGridApi] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [selected, setSelectedData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState([]);

  const attendanceApiCaller = async (params) => {
    try {
      let resp = await api.post("/graphql", {
        variables: params,
        query: MARK_ATTENDANCE,
      });
      console.log("DATA", resp.data);
    } catch (err) {
      console.log("MARK_ATTENDANCE_ERR", err);
    }
  };

  const getRowData = async ({ data, node: { selected } }) => {
    if (selected) {
      return;
    }
    await attendanceApiCaller({
      session,
      present: selected,
      program_enrollment_id: Number(data.program_enrollment_id),
    });
  };

  const getSelectedRowData = () => {
    if (!gridApi) {
      return null;
    }
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => ({
      session,
      present: true,
      program_enrollment_id: Number(node.data.program_enrollment_id),
    }));
    setSelectedData(selectedData);
  };

  const onGridReady = async (params) => {
    params.api.selectAll();
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  console.log("SELECTED", selected);

  const markAttendance = async () => {
    setLoading(true);
    await selected.forEach(async (student) => {
      await attendanceApiCaller(student);
    });
    setLoading(false);
  };

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
            onGridReady={onGridReady}
            rowSelection={"multiple"}
            onRowSelected={getRowData}
            suppressRowClickSelection={true}
            onSelectionChanged={getSelectedRowData}
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
            <AgGridColumn
              sortable
              headerName=""
              cellStyle={cellStyle}
              checkboxSelection={true}
            />
          </AgGridReact>
        </div>
      </div>
      <div className="col-12 mt-3">
        <button
          disabled={isLoading}
          onClick={markAttendance}
          className="btn btn-primary btn-regular"
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default SessionStudentList;

/**
 
 */
