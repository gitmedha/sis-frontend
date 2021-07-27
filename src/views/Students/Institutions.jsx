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
import { GET_USER_INSTITUTES } from "../../graphql";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import TabPicker from "../../components/content/TabPicker";
import Pagination from '../../components/content/Pagination';

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const Institutions = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsAggregate, setInstitutionsAggregate] = useState([]);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  const paginationPageSize = 10;

  useEffect(() => {}, [activeTab, isLoading]);

  const getAllInstitutes = async () => {
    NP.start();
    // setLoading(true);
    await api.post("/graphql", {
      query: GET_USER_INSTITUTES,
      variables: {
        // id: user.id,
        id: 2,
        sort: "created_at:desc",
      },
    })
    .then(data => {
      let institutions = data?.data?.data?.institutionsConnection.values;
      institutions = institutions.map((institution) => {
        institution.assigned_to.text = institution.assigned_to.username;
        institution.assigned_to.to = '/user/' + institution.assigned_to.id;
        return institution;
      })
      setInstitutions(institutions);
      setInstitutionsAggregate(data?.data?.data?.institutionsConnection?.aggregate);
      setRowData(institutions); // setting the data for the table
      return institutions;
    })
    .catch(error => {
      console.log("INSTITUTIONS", error);
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
      NP.done();
    });
  };

  const onPageChanged = (data) => {
    const { currentPage } = data;
    if (gridApi) {
      gridApi.paginationGoToPage(currentPage);
    }
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    getAllInstitutes();
  };

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
            rowClass='w-100'
            pagination={true}
            paginationPageSize={paginationPageSize}
            suppressPaginationPanel={true}
            onGridReady={onGridReady}
            rowData={rowData}
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
          {institutionsAggregate && <Pagination totalRecords={institutionsAggregate.count} pageLimit={paginationPageSize} pageNeighbours={2} onPageChanged={onPageChanged} />}
        </div>
      ) : (
        <Skeleton count={3} height={50} />
      )}
    </div>
  );
};

export default Institutions;
