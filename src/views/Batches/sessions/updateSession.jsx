import moment from "moment";
import { difference } from "lodash";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { queryBuilder } from "../../../apis";
import Skeleton from "react-loading-skeleton";
import {
  cellStyle,
  SerialNumberRenderer,
} from "../../../components/content/AgGridUtils";
import { Form, Input } from "../../../utils/Form";
import {
  UPDATE_SESSION_QUERY,
  UPDATE_SESSION_ATTENDANCE,
} from "../../../graphql";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import Collapsible from "../../../components/content/CollapsiblePanels";
import { getSessions } from "../../../store/reducers/sessionAttendances/actions";

const UpdateSession = (props) => {
  const { session, loading, attendances, getSessions } = props;
  const sessionID = props.match.params.sessionID;

  // eslint-disable-next-line
  const [gridApi, setGridApi] = useState(null);
  // eslint-disable-next-line
  const [gridColumnApi, setGridColumnApi] = useState([]);
  const [isUpdating, setUpdating] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [gridIntialized, setInitialized] = useState(false);

  // Original Copy of attendance List
  const [oriAttendanceList, setOriAttendanceList] = useState([]);

  // Update Flag
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!session && !attendances.length) {
      getSessions(sessionID);
    }
    // eslint-disable-next-line
  }, []);

  const onGridReady = async (params) => {
    let list = [];
    params.api.forEachNode((node) => {
      node.setSelected(node.data.present);
      list.push({
        id: Number(node.data.id),
        data: { present: node.data.present },
      });
    });
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setAttendanceList(list);
    setOriAttendanceList(list);
    setInitialized(true);
  };

  const getRowData = async ({ node: { selected }, data: { id } }) => {
    if (!gridIntialized) {
      return;
    }
    let updatedList = attendanceList.map((attendanceItem) => {
      if (Number(id) === Number(attendanceItem.id)) {
        return {
          ...attendanceItem,
          data: {
            present: selected,
          },
        };
      }
      return attendanceItem;
    });
    setAttendanceList(updatedList);
  };

  const onSubmit = async (values) => {
    setUpdating(true);
    try {
      // let updated = false;

      const prevSessionVal = {
        topics_covered: session.topics_covered,
        date: session.date,
      };

      let queryVars = {
        id: Number(values.id),
        data: {
          topics_covered: values.topics_covered,
          date: moment(values.date).format("YYYY-MM-DD"),
        },
      };

      // Check if the data is updated or not
      if (JSON.stringify(prevSessionVal) !== JSON.stringify(queryVars.data)) {
        setUpdated(true);
      }

      await apiCaller(queryVars);
    } catch (err) {
      console.log("UPDATE_SESSION_ERR", err);
    } finally {
      setUpdating(false);
    }
  };

  const apiCaller = async (queryVars) => {
    if (updated) {
      let { data } = await queryBuilder({
        variables: queryVars,
        query: UPDATE_SESSION_QUERY,
      });
      console.log("RESP_DATA", data);
    }
    attendanceUpdated();
  };

  const attendanceUpdated = async () => {
    // New Need to check if the old data is updated or not
    let updatedRec = difference(attendanceList, oriAttendanceList);
    await updatedRec.forEach(async (att) => {
      await queryBuilder({
        variables: att,
        query: UPDATE_SESSION_ATTENDANCE,
      });
    });
    return;
  };

  return (
    <Collapsible title="Update Session" type="plain" opened={true}>
      {loading && (
        <div className="px-2 pt-2">
          <Skeleton height={65} count={5} />
        </div>
      )}
      {attendances.length ? (
        <div className="container">
          <Form
            onSubmit={onSubmit}
            initialValues={{
              ...session,
              date: new Date(session.date),
            }}
          >
            <div className="row my-3">
              <div className="col-md-6 col-sm-12">
                <Input
                  name="date"
                  label="Date"
                  control="datepicker"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12">
                <Input
                  control="input"
                  name="topics_covered"
                  label="Topics Covered"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12">
                <div
                  className="ag-theme-alpine"
                  style={{ height: "50vh", width: "100%" }}
                >
                  <AgGridReact
                    rowData={attendances}
                    frameworkComponents={{
                      sno: SerialNumberRenderer,
                    }}
                    onGridReady={onGridReady}
                    rowSelection={"multiple"}
                    onRowSelected={getRowData}
                    // onSelectionChanged={updateAtt}
                    rowMultiSelectWithClick={true}
                  >
                    <AgGridColumn
                      sortable
                      field="id"
                      cellRenderer="sno"
                      headerName="S. No."
                      cellStyle={cellStyle}
                    />
                    <AgGridColumn
                      sortable
                      headerName="Name"
                      cellStyle={cellStyle}
                      valueGetter={nameGetter}
                      field="program_enrollment"
                    />
                    <AgGridColumn
                      cellStyle={cellStyle}
                      checkboxSelection={true}
                      headerName="Mark Attendance"
                    />
                  </AgGridReact>
                </div>
              </div>
            </div>
            <div className="col-12 mt-3 d-flex">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary btn-regular"
              >
                SAVE
              </button>
              <div style={{ width: "10px" }} />
              <Link
                type="button"
                to={`/session/${sessionID}`}
                className="btn btn-primary btn-regular"
              >
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      ) : null}
    </Collapsible>
  );
};

const nameGetter = (params) =>
  `${params.data.program_enrollment.student.first_name} ${params.data.program_enrollment.student.last_name}`;

const mapStateToProps = (state) => ({
  session: state.sessionAttendance.session,
  loading: state.sessionAttendance.loading,
  attendances: state.sessionAttendance.attendances,
});

const mapActionsToProps = {
  getSessions,
};

export default connect(mapStateToProps, mapActionsToProps)(UpdateSession);
