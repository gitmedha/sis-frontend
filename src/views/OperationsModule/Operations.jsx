import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback, Fragment } from "react";
import { useHistory } from "react-router-dom";
import {
  GET_ALUMNI_QUERIES,
  GET_COLLEGE_PITCHES,
  GET_DTE_SAMARTH_SDITS,
  GET_OPERATIONS,
  GET_STUDENTS_UPSKILLINGS,
  GET_USERSTOTS,
} from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Table from "../../components/content/Table";
import { setAlert } from "../../store/reducers/Notifications/actions";
import Collapse from "../../components/content/CollapsiblePanels";
import { isAdmin, isSRM } from "../../common/commonFunctions";
import OperationCreateform from "./OperationComponents/OperationCreateform";
import OperationDataupdateform from "./OperationComponents/OperationDataupdateform";
import UserTot from "./OperationComponents/UserTot";
import StudentUpkillingBulkcreate from "./OperationComponents/StudentUpkillingBulkcreate";
import Dtesamarth from "./OperationComponents/Dtesamarth";
import Opsdatafeilds from "./OperationComponents/Opsdatafeilds";
import Totdatafield from "./OperationComponents/Totdatafield";
import Upskillingdatafield from "./OperationComponents/Upskillingdatafield";
import Dtesamarthdatafield from "./OperationComponents/Dtesamarthdatafield";
import Alumuniqueriesdata from "./OperationComponents/Alumuniqueriesdata";
import CollegePitchdata from "./OperationComponents/CollegePitchdata";
import AllumuniBulkAdd from "./OperationComponents/AllumuniBulkAdd";
import CollegepitchesBulkadd from "./OperationComponents/CollegepitchesBulkadd";
import OpsSearchDropdown from "./OperationComponents/OpsSearchBar";
import UpskillSearchBar from "./OperationComponents/UpskillSearchBar";
import TotSearchBar from "./OperationComponents/TotSearchBar";
import SamarthSearchBar from "./OperationComponents/SamarthSearchBar";
import CollegePitchSearch from "./OperationComponents/CollegePitchSearch";
import AlumniSearchBar from "./OperationComponents/AlumniSearchBar";
import {
  sortAscending,
  resetSearch,
} from "../../store/reducers/Operations/actions";

const tabPickerOptionsMain = [
  { title: "Core Programs", key: "coreProgramme" },
  { title: "Alumni", key: "alum" },
  { title: "System Adoption", key: "systemAdoption" },
];

const tabPickerOptions1 = [
  { title: "User Ops Activities", key: "my_data" },
  { title: "Student Upskilling", key: "upskilling" },
  // { title: "Dte-Samarth-Sdit", key: "dtesamarth" },
  { title: "Pitching", key: "collegePitches" },
];
const tabPickerOptions2=[
  { title: "Alumni Queries", key: "alumniQueries" },
]
const tabPickerOptions3 =[
  { title: "TOT", key: "useTot" },
]

const Styled = styled.div`
  .MuiSwitch-root {
    // material switch
    margin-left: 5px;
    margin-right: 5px;

    .MuiSwitch-switchBase {
      color: #207b69;
    }
    .MuiSwitch-track {
      background-color: #c4c4c4;
      opacity: 1;
    }
  }
`;

const Operations = ({
  opsData,
  setAlert,
  sortAscending,
  resetSearch,
  isFound,
  isSearching,
}) => {
  const [showModal, setShowModal] = useState({
    opsdata: false,
    totdata: false,
    upskilldata: false,
    sditdata: false,
    alumniQueriesdata: false,
    collegePitches: false,
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState([]);
  const [optsdata, setOptsdata] = useState({
    opsdata: {},
    totdata: {},
    upskilldata: {},
    sditdata: {},
    alumniQueriesdata: {},
    collegePitches: {},
  });
  const [optsAggregate, setoptsAggregate] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState("list");
  const [activeTabMain, setActiveTabMain] = useState(tabPickerOptionsMain[0]);
  const [activeTab, setActiveTab] = useState(tabPickerOptions1[0]);
  const [tabpickestatus,settabpickerstatus]=useState({
    tab1:true,
    
  })
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [searchedData, setSearchedData] = useState([]);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");

  const columns = useMemo(
    () => [
      {
        Header: "Assigned To",
        accessor: "assigned_to.username",
      },
      {
        Header: "Activity type",
        accessor: "activity_type",
      },

      {
        Header: "Medha Area",
        accessor: "area",
      },

      {
        Header: "Batch",
        accessor: "batch.name",
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "End Date",
        accessor: "end_date",
      },
      {
        Header: "Topic",
        accessor: "topic",
      },

      // {
      //   Header: "Guest",
      //   accessor: "guest",
      // },

      // {
      //   Header: "Organization",
      //   accessor: "organization",
      // },
    ],
    []
  );

  const columnsUserTot = useMemo(
    () => [
      {
        Header: "Participant Name",
        accessor: "user_name",
      },
      {
        Header: "City",
        accessor: "city",
      },

      {
        Header: "Project Name",
        accessor: "project_name",
      },

      {
        Header: "Project Department",
        accessor: "partner_dept",
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "End Date",
        accessor: "end_date",
      },
    ],
    []
  );

  const columnsUpskilling = useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "student_id.full_name",
      },
      {
        Header: "Assigned to",
        accessor: "assigned_to.username",
      },
      {
        Header: "Institute Name",
        accessor: "institution.name",
      },
      {
        Header: "Course Name",
        accessor: "course_name",
      },
      {
        Header: "Batch",
        accessor: "batch.name",
      },

      {
        Header: "Category",
        accessor: "category",
      },
    ],
    []
  );
  const columnsPlacement = useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "student_name",
      },

      {
        Header: "Institution Name",
        accessor: "institution_name",
      },
      {
        Header: "Course Name",
        accessor: "course_name",
      },
      {
        Header: "Academic Year",
        accessor: "acad_year",
      },
      {
        Header: "Company Placed",
        accessor: "company_placed",
      },
      {
        Header: "Batch",
        accessor: "batch_name",
      },

      {
        Header: "Result",
        accessor: "result",
      },
    ],
    []
  );

  const columnsAlumuniqueries = useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "student_name",
      },
      {
        Header: "Father Name",
        accessor: "father_name",
      },
      {
        Header: "Mobile No.",
        accessor: "phone",
      },
      {
        Header: "Query Description",
        accessor: "query_desc",
      },
      {
        Header: "Query End Date",
        accessor: "query_end",
      },

      {
        Header: "Query Start Date",
        accessor: "query_start",
      },
      {
        Header: "Query Type",
        accessor: "query_type",
      },
    ],
    []
  );

  const columnscollegepitches = useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "student_name",
      },
      {
        Header: "Medha Area",
        accessor: "area",
      },
      {
        Header: "Mobile No.",
        accessor: "phone",
      },
      {
        Header: "College Name",
        accessor: "college_name",
      },
      {
        Header: "Course Name",
        accessor: "course_name",
      },

      {
        Header: "Course Year",
        accessor: "course_year",
      },
      {
        Header: "Pitch Date",
        accessor: "pitch_date",
      },
    ],
    []
  );
  const getoperations = async (
    status = "All",
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    nProgress.start();
    setLoading(true);
    let variables = {
      limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
      isActive: false,
    };
    console.log(activeTab, "grhg");
    if (activeTab.key == "my_data") {
      await resetSearch();
      await api
        .post("/graphql", {
          query: GET_OPERATIONS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.usersOpsActivitiesConnection.values);
          setoptsAggregate(
            data.data.data.usersOpsActivitiesConnection.aggregate
          );
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    if (activeTab.key == "useTot") {
      await resetSearch();
      await api
        .post("/graphql", {
          query: GET_USERSTOTS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.usersTotsConnection.values);
          setoptsAggregate(data.data.data.usersTotsConnection.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }

    if (activeTab.key == "upskilling") {
      await resetSearch();

      await api
        .post("/graphql", {
          query: GET_STUDENTS_UPSKILLINGS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.studentsUpskillingsConnection.values);
          setoptsAggregate(
            data.data.data.studentsUpskillingsConnection.aggregate
          );
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    if (activeTab.key == "dtesamarth") {
      await resetSearch();

      await api
        .post("/graphql", {
          query: GET_DTE_SAMARTH_SDITS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.dteSamarthSditsConnection.values);
          setoptsAggregate(data.data.data.dteSamarthSditsConnection.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    if (activeTab.key == "alumniQueries") {
      await resetSearch();

      await api
        .post("/graphql", {
          query: GET_ALUMNI_QUERIES,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.alumniQueriesConnection.values);
          setoptsAggregate(data.data.data.alumniQueriesConnection.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    if (activeTab.key == "collegePitches") {
      await resetSearch();

      await api
        .post("/graphql", {
          query: GET_COLLEGE_PITCHES,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.collegePitchesConnection.values);
          setoptsAggregate(data.data.data.collegePitchesConnection.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
  };

  useEffect(() => {
    if (isSearching) {
      fetchSearchedData(0, pageSize, []);
    }
  }, [isSearching]);

  const fetchData = useCallback(
    (pageIndex, pageSize, sortBy) => {
      if (activeTab.key == "my_data") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "area":
            case "assigned_to.username":
            case "activity_type":
            case "batch.name":
              sortByField = sortBy[0].id;
              break;

            default:
              sortByField = "assigned_to.username";
              break;
          }

          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        } else {
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
      if (activeTab.key == "useTot") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "user_name":
            case "city":
            case "project_name":
            case "partner_dept":
              sortByField = sortBy[0].id;
              break;

            default:
              sortByField = "user_name";
              break;
          }

          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        } else {
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
      if (activeTab.key == "upskilling") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "assigned_to.username":
            case "student_id.full_name":
            case "institution.name":
            case "course_name":
              sortByField = sortBy[0].id;
              break;

            default:
              sortByField = "course_name";
              break;
          }

          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        } else {
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
      if (activeTab.key == "dtesamarth") {
        if (sortBy.length) {
          let sortByField;
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "student_name":
            case "institution_name":
            case "course_name":
              sortByField = sortBy[0].id;
              break;

            default:
              break;
          }

          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        } else {
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
      if (activeTab.key == "alumniQueries") {
        if (sortBy.length) {
          let sortByField;
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "student_name":
            case "father_name":
            case "query_start":
            case "query_end":
              sortByField = sortBy[0].id;
              break;
            default:
              break;
          }
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        } else {
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
      if (activeTab.key == "collegePitches") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "student_name":
            case "area":
            case "college_name":
            case "course_name":
              sortByField = sortBy[0].id;
              break;

            default:
              sortByField = "student_name";
              break;
          }
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        } else {
          getoperations(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
    },
    [activeTab, activeStatus]
  );


  useEffect(() => {
    fetchData(0, paginationPageSize, []);
  }, [activeTab.key, activeStatus]);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);

  const hideShowModal = async (key, data) => {
    if (!data || data.isTrusted) {
      getoperations();
      setShowModal({ ...showModal, [key]: data });
      return;
    }
  };
  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }
  };

  const showRowData = (key, data) => {
    setOptsdata({ ...optsdata, [key]: data });
    setShowModal({ ...showModal, [key]: true });
  };

  const arrangeRows = async (startFrom) => {
    let filteredArray = [];
    for (let element = 0; element < pageSize; element++) {
      if (element + 1 > opsData.length) {
        break;
      }
      if (opsData[startFrom]) {
        filteredArray.push(opsData[startFrom]);
      }
      startFrom++;
    }
    setSearchedData(filteredArray);
  };

  const ascendingSort = async (sortByField, arrayOfResult) => {
    try {
      const sortedData = [...arrayOfResult];
      sortedData.sort((a, b) => {
        const valueA = getField(a, sortByField);
        const valueB = getField(b, sortByField);

        return valueA.localeCompare(valueB);
      });

      await sortAscending(sortedData);
    } catch (error) {
      console.error("error", error);
    }
  };

  const descendingSort = async (sortByField, arrayOfResult) => {
    try {
      const sortedData = [...arrayOfResult];
      sortedData.sort((a, b) => {
        const valueA = getField(a, sortByField);
        const valueB = getField(b, sortByField);

        return valueB.localeCompare(valueA);
      });

      await sortAscending(sortedData);
    } catch (err) {
      console.log("error", err);
    }
  };

  const getField = (object, fieldPath) => {
    const fieldParts = fieldPath.split(".");
    let value = object;

    for (const part of fieldParts) {
      value = value[part];
    }

    return value;
  };

  const fetchSearchedData = useCallback(
    async (pageIndex, pageSize, sortBy) => {
      let startFrom = (pageIndex + 1) * pageSize - pageSize;
      let filteredArray = [];

      if (sortBy.length) {
        const { id, desc } = sortBy[0];
        desc ? descendingSort(id, opsData) : ascendingSort(id, opsData);
        arrangeRows(startFrom);
      } else {
        for (let element = 0; element < pageSize; element++) {
          if (element + 1 > opsData.length) {
            break;
          }
          if (opsData[startFrom]) {
            filteredArray.push(opsData[startFrom]);
          }
          startFrom++;
        }

        setSearchedData(filteredArray);
      }
    },
    [opsData]
  );
  useEffect(()=>{
    console.log("activeTabMain",activeTabMain)
      {/* // { title: "Core Programme", key: "coreProgramme" },
// { title: "Alumni", key: "alum" },
// { title: "System Adoption", key: "systemAdoption" },tabPickerOptions1 */}

if(activeTabMain.key == 'alum' ){
  setActiveTab(tabPickerOptions2[0])
}
if(activeTabMain.key == 'systemAdoption' ){
  setActiveTab(tabPickerOptions3[0])
}
if(activeTabMain.key == 'coreProgramme' ){
  setActiveTab(tabPickerOptions1[0])
}
console.log("activeTab",activeTab);

  },[activeTabMain.key])

  return (
    <Collapse title="OPERATIONS" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          <div className="d-flex flex-column flex-md-row justify-content-between  align-items-center mb-2">
            <TabPicker
              options={tabPickerOptionsMain}
              setActiveTab={setActiveTabMain}
            />
             {
              activeTabMain.key =='coreProgramme'? <TabPicker options={tabPickerOptions1} setActiveTab={setActiveTab} /> : activeTabMain.key =='alum'? <TabPicker options={tabPickerOptions2} setActiveTab={setActiveTab} />:activeTabMain.key =='systemAdoption' ? <TabPicker options={tabPickerOptions3} setActiveTab={setActiveTab} /> :''
            }
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
        
           
        {/* <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} /> */}

        {(isSRM() || isAdmin()) && (
          <button
            className="btn btn-primary"
            onClick={() => setModalShow(true)}
            style={{ marginLeft: "15px" }}
          >
            Add New Data
          </button>
        )}
      </div>
          </div>
          
          <div className={`${layout !== "list" ? "d-none" : ""}`}>
            {activeTab.key == "my_data" ? (
              <>
                <OpsSearchDropdown />
                <Table
                  onRowClick={(data) => showRowData("opsdata", data)}
                  columns={columns}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={
                    isSearching ? opsData.length : optsAggregate.count
                  }
                  fetchData={isSearching ? fetchSearchedData : fetchData}
                  paginationPageSize={paginationPageSize}
                  onPageSizeChange={setPaginationPageSize}
                  paginationPageIndex={paginationPageIndex}
                  onPageIndexChange={setPaginationPageIndex}
                />
              </>
            ) : activeTab.key == "useTot" ? (
              <>
                <TotSearchBar />
                <Table
                  onRowClick={(data) => showRowData("totdata", data)}
                  columns={columnsUserTot}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={
                    isSearching ? opsData.length : optsAggregate.count
                  }
                  fetchData={isSearching ? fetchSearchedData : fetchData}
                  paginationPageSize={paginationPageSize}
                  onPageSizeChange={setPaginationPageSize}
                  paginationPageIndex={paginationPageIndex}
                  onPageIndexChange={setPaginationPageIndex}
                />
              </>
            ) : activeTab.key == "upskilling" ? (
              <>
                <UpskillSearchBar />
                <Table
                  onRowClick={(data) => showRowData("upskilldata", data)}
                  columns={columnsUpskilling}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={
                    isSearching ? opsData.length : optsAggregate.count
                  }
                  fetchData={isSearching ? fetchSearchedData : fetchData}
                  paginationPageSize={paginationPageSize}
                  onPageSizeChange={setPaginationPageSize}
                  paginationPageIndex={paginationPageIndex}
                  onPageIndexChange={setPaginationPageIndex}
                />
              </>
            ) : activeTab.key == "dtesamarth" ? (
              <>
                {/* <SamarthSearchBar />
                <Table
                  onRowClick={(data) => showRowData("sditdata", data)}
                  columns={columnsPlacement}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={
                    isSearching ? opsData.length : optsAggregate.count
                  }
                  fetchData={isSearching ? fetchSearchedData : fetchData}
                  paginationPageSize={paginationPageSize}
                  onPageSizeChange={setPaginationPageSize}
                  paginationPageIndex={paginationPageIndex}
                  onPageIndexChange={setPaginationPageIndex}
                /> */}
              </>
            ) : activeTab.key == "alumniQueries" ? (
              <>
                <AlumniSearchBar />
                <Table
                  onRowClick={(data) => showRowData("alumniQueriesdata", data)}
                  columns={columnsAlumuniqueries}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={
                    isSearching ? opsData.length : optsAggregate.count
                  }
                  fetchData={isSearching ? fetchSearchedData : fetchData}
                  paginationPageSize={paginationPageSize}
                  onPageSizeChange={setPaginationPageSize}
                  paginationPageIndex={paginationPageIndex}
                  onPageIndexChange={setPaginationPageIndex}
                />
              </>
            ) : activeTab.key == "collegePitches" ? (
              <>
                <CollegePitchSearch />
                <Table
                  onRowClick={(data) => showRowData("collegePitches", data)}
                  columns={columnscollegepitches}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={
                    isSearching ? opsData.length : optsAggregate.count
                  }
                  fetchData={isSearching ? fetchSearchedData : fetchData}
                  paginationPageSize={paginationPageSize}
                  onPageSizeChange={setPaginationPageSize}
                  paginationPageIndex={paginationPageIndex}
                  onPageIndexChange={setPaginationPageIndex}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          {activeTab.key == "my_data"
            ? (isSRM() || isAdmin()) && (
                <OperationCreateform
                  show={modalShow}
                  onHide={hideCreateModal}
                  ModalShow={() => setModalShow(false)}
                />
              )
            : // useTot  ---upskilling ---dtesamarth
            activeTab.key == "useTot"
            ? (isSRM() || isAdmin()) && (
                <UserTot
                  show={modalShow}
                  onHide={hideCreateModal}
                  ModalShow={() => setModalShow(false)}
                />
              )
            : activeTab.key == "upskilling"
            ? (isSRM() || isAdmin()) && (
                <StudentUpkillingBulkcreate
                  show={modalShow}
                  onHide={hideCreateModal}
                  ModalShow={() => setModalShow(false)}
                />
              )
            : activeTab.key == "dtesamarth"
            ? (isSRM() || isAdmin()) && (
                <Dtesamarth
                  show={modalShow}
                  onHide={hideCreateModal}
                  ModalShow={() => setModalShow(false)}
                />
              )
            : activeTab.key == "alumniQueries"
            ? (isSRM() || isAdmin()) && (
                <AllumuniBulkAdd
                  show={modalShow}
                  onHide={hideCreateModal}
                  ModalShow={() => setModalShow(false)}
                />
              )
            : activeTab.key == "collegePitches"
            ? (isSRM() || isAdmin()) && (
                <CollegepitchesBulkadd
                  show={modalShow}
                  onHide={hideCreateModal}
                  ModalShow={() => setModalShow(false)}
                />
              )
            : ""}
          {showModal.opsdata && (isSRM() || isAdmin()) && (
            <Opsdatafeilds
              {...optsdata.opsdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("opsdata", false)}
            />
          )}
          {showModal.totdata && (isSRM() || isAdmin()) && (
            <Totdatafield
              {...optsdata.totdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("totdata", false)}
            />
          )}
          {showModal.upskilldata && (isSRM() || isAdmin()) && (
            <Upskillingdatafield
              {...optsdata.upskilldata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("upskilldata", false)}
            />
          )}
          {showModal.sditdata && (isSRM() || isAdmin()) && (
            <Dtesamarthdatafield
              {...optsdata.sditdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("sditdata", false)}
            />
          )}
          {showModal.alumniQueriesdata && (isSRM() || isAdmin()) && (
            <Alumuniqueriesdata
              {...optsdata.alumniQueriesdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("alumniQueriesdata", false)}
            />
          )}
          {showModal.collegePitches && (isSRM() || isAdmin()) && (
            <CollegePitchdata
              {...optsdata.collegePitches}
              show={showModal.opsdata}
              onHide={() => hideShowModal("collegePitches", false)}
            />
          )}
        </div>
      </Styled>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({
  opsData: state.Operations.data,
  isFound: state.Operations.isFound,
  isSearching: state.Operations.isSearching,
});

const mapActionsToProps = {
  setAlert,
  sortAscending,
  resetSearch,
};

export default connect(mapStateToProps, mapActionsToProps)(Operations);
