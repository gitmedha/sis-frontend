import NP from "nprogress";
import api from "../../apis";
import moment from "moment";
import { useState, useEffect } from "react";
import { GET_BATCHES } from "../../graphql";
import Skeleton from "react-loading-skeleton";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import Collapse from "../../components/content/CollapsiblePanels";
import {
  TableLink,
  cellStyle,
  BadgeRenderer,
} from "../../components/content/AgGridUtils";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getBatches = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_BATCHES,
        variables: {
          limit: 10,
          // id: user.id,
          id: 2,
          sort: "created_at:desc",
        },
      });
      // Set Seed Data Later we will push in Real Values
      setBatches(data.data.batches);
    } catch (err) {
      console.log("BATCHES", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  useEffect(() => {
    getBatches();
  }, []);

  return (
    <Collapse title="All Batches" opened={true}>
      {!isLoading ? (
        <div
          className="ag-theme-alpine"
          style={{ height: "50vh", width: "100%" }}
        >
          <AgGridReact
            rowData={batches}
            frameworkComponents={{
              link: TableLink,
              badgeRenderer: BadgeRenderer,
            }}
          >
            <AgGridColumn
              sortable
              field="name"
              headerName="Name"
              cellStyle={cellStyle}
            />
            <AgGridColumn
              sortable
              headerName="Program"
              field="program.name"
              cellStyle={cellStyle}
            />
            <AgGridColumn
              sortable
              headerName="Number of Students"
              field="number_of_students.total"
              cellStyle={cellStyle}
            />
            <AgGridColumn
              sortable
              field="status"
              headerName="Status"
              cellRenderer="badgeRenderer"
            />
            <AgGridColumn
              sortable
              width={210}
              field="start_date"
              cellStyle={cellStyle}
              headerName="Start Date"
              cellRenderer={({ value }) => moment(value).format("DD MMM YYYY")}
            />
            <AgGridColumn
              field="id"
              width={70}
              headerName=""
              cellRenderer="link"
              cellRendererParams={{ to: "batch" }}
            />
          </AgGridReact>
        </div>
      ) : (
        <Skeleton count={3} height={50} />
      )}
    </Collapse>
  );
};

export default Batches;
