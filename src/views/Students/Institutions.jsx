import NP from "nprogress";
import api from "../../apis";
import {
  TableLink,
  BadgeRenderer,
  AvatarRenderer,
  SerialNumberRenderer,
  LinkRenderer,
} from "../../components/content/AgGridUtils";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { GET_MY_INSTITUTES } from "../../graphql";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import TabPicker from "../../components/content/TabPicker";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const cellStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  fontFamily: "Latto-Regular",
};

const Institutions = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  useEffect(() => {}, [activeTab]);

  const getAllInstitutes = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_MY_INSTITUTES,
        variables: {
          limit: 10,
          // id: user.id,
          id: 2,
          sort: "created_at:desc",
        },
      });
      let institutions = data.data.institutions;
      institutions = data.data.institutions.map((institution) => {
        institution.assigned_to.text = institution.assigned_to.username;
        institution.assigned_to.to = '/user/' + institution.assigned_to.id;
        return institution;
      })
      console.log(institutions);
      setInstitutions(institutions);
    } catch (err) {
      console.log("INSTITUTIONS", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  useEffect(() => {
    getAllInstitutes();
  }, []);

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
        <button
          className="btn btn-primary"
          onClick={() => history.push("/institution/new")}
        >
          Add New Institution
        </button>
      </div>
      {!isLoading ? (
        <div
          className="ag-theme-alpine"
          style={{ height: "60vh", width: "100%" }}
        >
          <AgGridReact
            rowHeight={60}
            rowData={institutions}
            frameworkComponents={{
              link: TableLink,
              sno: SerialNumberRenderer,
              badgeRenderer: BadgeRenderer,
              avatarRenderer: AvatarRenderer,
              linkRenderer: LinkRenderer,
            }}
          >
            <AgGridColumn
              sortable
              field="sno"
              width={100}
              cellRenderer="sno"
              headerName="#"
            />
            <AgGridColumn
              sortable
              width={300}
              headerName="Name"
              field="name"
              cellRenderer="avatarRenderer"
            />
            <AgGridColumn
              sortable
              width={300}
              headerName="Assigned To"
              field="assigned_to"
              cellRenderer="linkRenderer"
            />
            <AgGridColumn
              sortable
              width={140}
              field="status"
              headerName="Status"
              cellRenderer="badgeRenderer"
            />
            <AgGridColumn
              sortable
              field="type"
              headerName="Type"
              cellRenderer="badgeRenderer"
            />
            <AgGridColumn
              field="id"
              width={70}
              headerName=""
              cellRenderer="link"
              cellRendererParams={{ to: "institution" }}
            />
          </AgGridReact>
        </div>
      ) : (
        <Skeleton count={3} height={50} />
      )}
    </div>
  );
};

export default Institutions;
