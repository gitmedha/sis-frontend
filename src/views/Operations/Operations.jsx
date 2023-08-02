import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { uploadFile } from "../../components/content/Utils";
import moment from "moment";
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  GET_DTE_SAMARTH_SDITS,
  GET_OPERATIONS,
  GET_STUDENTS_UPSKILLINGS,
  GET_USERSTOTS,
} from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from "../../components/content/Table";
import { setAlert } from "../../store/reducers/Notifications/actions";
import Collapse from "../../components/content/CollapsiblePanels";
import { isAdmin, isSRM } from "../../common/commonFunctions";
import OperationCreateform from "./OperationComponents/OperationCreateform";
import OperationDataupdateform from "./OperationComponents/OperationDataupdateform";
import axios from "axios";
import UserTot from "./OperationComponents/UserTot";
import StudentUpkillingBulkcreate from "./OperationComponents/StudentUpkillingBulkcreate";
import Dtesamarth from "./OperationComponents/Dtesamarth";
import Opsdatafeilds from "./OperationComponents/Opsdatafeilds";
import Totdatafield from "./OperationComponents/Totdatafield";
import Upskillingdatafield from "./OperationComponents/Upskillingdatafield";
import Dtesamarthdatafield from "./OperationComponents/Dtesamarthdatafield";

const tabPickerOptions = [
  { title: "User Ops Activities", key: "my_data" },
  { title: "Users Tot", key: "useTot" },
  { title: "Upskilling", key: "upskilling" },
  { title: "DTE-SAMARTHSDITS", key: "dtesamarth" },
];

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

const Operations = (props) => {
  const [showModal, setShowModal] = useState({
    opsdata:false,
    totdata:false,
    upskilldata:false,
    sditdata:false
  });
  const { setAlert } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState([]);
  const [optsdata, setOptsdata] = useState({
    opsdata:{},
    totdata:{},
    upskilldata:{},
    sditdata:{}
  });
  const [optsAggregate, setoptsAggregate] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState("list");
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
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
        Header: "Area",
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

      {
        Header: "Guest",
        accessor: "guest",
      },

      {
        Header: "Organization",
        accessor: "organization",
      },
    ],
    []
  );

  const columnsUserTot = useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "user_name",
      },
      {
        Header: "City",
        accessor: "city",
      },

      {
        Header: "Propject Name",
        accessor: "project_name",
      },

      {
        Header: "Batch",
        accessor: "partner_dept",
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "End Date",
        accessor: "module_name",
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
        Header: "Institute Name",
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
    };
    if (activeTab.key == "my_data") {
      await api
        .post("/graphql", {
          query: GET_OPERATIONS,
          variables,
        })
        .then((data) => {
          console.log(
            "data",
            data.data.data.usersOpsActivitiesConnection.values
          );
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
      await api
        .post("/graphql", {
          query: GET_USERSTOTS,
          variables,
        })
        .then((data) => {
          console.log("data12", data.data.data.usersTotsConnection.values);
          setOpts(data.data.data.usersTotsConnection.values);
          // setoptsAggregate(data.data.data.usersOpsActivitiesConnection.aggregate)
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
      await api
        .post("/graphql", {
          query: GET_STUDENTS_UPSKILLINGS,
          variables,
        })
        .then((data) => {
          console.log(
            "data12",
            data.data.data.studentsUpskillingsConnection.values
          );
          setOpts(data.data.data.studentsUpskillingsConnection.values);
          // setoptsAggregate(data.data.data.usersOpsActivitiesConnection.aggregate)
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
      await api
        .post("/graphql", {
          query: GET_DTE_SAMARTH_SDITS,
          variables,
        })
        .then((data) => {
          console.log(
            "data12",
            data.data.data.dteSamarthSditsConnection.values
          );
          setOpts(data.data.data.dteSamarthSditsConnection.values);
          // setoptsAggregate(data.data.data.usersOpsActivitiesConnection.aggregate)
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    // dtesamarth
  };

  const fetchData = useCallback(
    (pageIndex, pageSize, sortBy) => {
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
            sortByField = "full_name";
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
    },
    [activeTab.key, activeStatus]
  );

  useEffect(() => {
    fetchData(0, paginationPageSize, []);
  }, [activeTab]);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);

  const hideShowModal = async (key,data) => {
    if (!data || data.isTrusted) {
      setShowModal({...showModal,[key]:data});
      return;
    }
  };
  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }
  };

  const showRowData = (key,data) => {
    console.log(key,"key1232")
    setOptsdata({...optsdata,[key]:data})
    setShowModal({...showModal,[key]:true});
  };
  useEffect(()=>{
  
    console.log(showModal)
    
  },[showModal])

  return (
    <Collapse title="OPERATIONS" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
            <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
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
          <div className={`${layout !== "list" ? "d-none" : ""}`}>
            {activeTab.key == "my_data" ? (
              <Table
                onRowClick={(data)=>showRowData("opsdata",data)}
                columns={columns}
                data={opts}
                totalRecords={optsAggregate.count}
                fetchData={fetchData}
                paginationPageSize={paginationPageSize}
                onPageSizeChange={setPaginationPageSize}
                paginationPageIndex={paginationPageIndex}
                onPageIndexChange={setPaginationPageIndex}
              />
            ) : activeTab.key == "useTot" ? (
              <Table
                onRowClick={(data)=>showRowData('totdata',data)}
                columns={columnsUserTot}
                data={opts}
                totalRecords={optsAggregate.count}
                fetchData={fetchData}
                paginationPageSize={paginationPageSize}
                onPageSizeChange={setPaginationPageSize}
                paginationPageIndex={paginationPageIndex}
                onPageIndexChange={setPaginationPageIndex}
              />
            ) : activeTab.key == "upskilling" ? (
              <Table
                onRowClick={(data)=>showRowData('upskilldata',data)}
                columns={columnsUpskilling}
                data={opts}
                totalRecords={optsAggregate.count}
                fetchData={fetchData}
                paginationPageSize={paginationPageSize}
                onPageSizeChange={setPaginationPageSize}
                paginationPageIndex={paginationPageIndex}
                onPageIndexChange={setPaginationPageIndex}
              />
            ) : activeTab.key == "dtesamarth" ? (
              <Table
                onRowClick={(data)=>showRowData('sditdata',data)}
                columns={columnsPlacement}
                data={opts}
                totalRecords={optsAggregate.count}
                fetchData={fetchData}
                paginationPageSize={paginationPageSize}
                onPageSizeChange={setPaginationPageSize}
                paginationPageIndex={paginationPageIndex}
                onPageIndexChange={setPaginationPageIndex}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          {activeTab.key == "my_data" ? (
            <OperationCreateform
              show={modalShow}
              onHide={hideCreateModal}
              ModalShow={() => setModalShow(false)}
            />
            // useTot  ---upskilling ---dtesamarth
          ) :activeTab.key == "useTot" ?(
            <UserTot show={modalShow} 
            onHide={hideCreateModal}
            ModalShow={() => setModalShow(false)}
            />
          ):activeTab.key == "upskilling"?(
            <StudentUpkillingBulkcreate show={modalShow} 
            onHide={hideCreateModal}
            ModalShow={() => setModalShow(false)}
            />
          ):activeTab.key == "dtesamarth" ?(
            <Dtesamarth show={modalShow} 
            onHide={hideCreateModal}
            ModalShow={() => setModalShow(false)}
            />
          ):""}
          {showModal.opsdata && (
            <Opsdatafeilds
              {...optsdata.opsdata}
              show={showModal.opsdata}
              onHide={()=>hideShowModal('opsdata',false)}
            />
          )}
          {showModal.totdata && (
            <Totdatafield
              {...optsdata.totdata}
              show={showModal.opsdata}
              onHide={()=>hideShowModal('totdata',false)}
            />
          )}
          {showModal.upskilldata && (
            <Upskillingdatafield
              {...optsdata.upskilldata}
              show={showModal.opsdata}
              onHide={()=>hideShowModal('upskilldata',false)}
            />
          )}
          {showModal.sditdata && (
            <Dtesamarthdatafield
              {...optsdata.sditdata}
              show={showModal.opsdata}
              onHide={()=>hideShowModal('sditdata',false)}
            />
          )}

        </div>
      </Styled>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Operations);
