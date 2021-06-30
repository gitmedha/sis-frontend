import Moment from "react-moment";
import Table from "../../../components/content/Table";
import ProgressBar from "@ramonak/react-progress-bar";
import { BadgeRenderer } from "../../../components/content/AgGridUtils";

const Details = ({ batch }) => {
  console.log("BATCH_DETAILS", batch);
  return (
    <div className="py-2 px-3">
      {/* <pre>
        <code>{JSON.stringify(batch, null, 2)}</code>
      </pre> */}
      <div className="row">
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">Batch Name</p>
          <p>{batch.name}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">Assigned To</p>
          <p>{batch.assigned_to?.username}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">Program</p>
          <p>{batch.program?.name}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">Area</p>
          <p>{"Shaheed Path"}</p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">Status</p>
          <BadgeRenderer value={batch.status} />
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">Start Date</p>
          <p>
            <Moment date={batch.start_date} format={"DD-MMM-YYYY"} />
          </p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">End Date</p>
          <p>
            <Moment date={batch.end_date} format={"DD-MMM-YYYY"} />
          </p>
        </div>
        <div className="col-md-4 col-sm-12 mb-3">
          <p className="text--primary latto-bold pb-0 mb-0">
            Name in Current SIS
          </p>
          <p>{batch.name_in_current_sis}</p>
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
          <button className="btn btn-regular btn-primary">EDIT</button>
          <button className="btn btn-regular btn-primary">DELETE</button>
          <button className="btn btn-regular btn-secondary">
            MARK As COMPLETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
