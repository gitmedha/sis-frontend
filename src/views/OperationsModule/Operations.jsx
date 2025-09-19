import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import { connect } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import {
  GET_ALUMNI_QUERIES,
  GET_COLLEGE_PITCHES,
  // GET_DTE_SAMARTH_SDITS,
  GET_MENTORSHIP,
  GET_OPERATIONS,
  GET_STUDENTS_UPSKILLINGS,
  GET_USERSTOTS,
  GET_ECOSYSTEM_DATA,
  GET_STUDENT_OUTREACHES,
  GET_CURRICULUM_INTERVENTIONS
} from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Table from "../../components/content/Table";
import { setAlert } from "../../store/reducers/Notifications/actions";
import Collapse from "../../components/content/CollapsiblePanels";
import { isAdmin, isMedhavi, isSRM } from "../../common/commonFunctions";
import OperationCreateform from "./OperationComponents/OperationCreateform";
import UserTot from "./OperationComponents/UserTot";
import StudentUpkillingBulkcreate from "./OperationComponents/StudentUpkillingBulkcreate";
// import Dtesamarth from "./OperationComponents/Dtesamarth";
import Opsdatafeilds from "./OperationComponents/Opsdatafeilds";
import Totdatafield from "./OperationComponents/Totdatafield";
import StudentOutreachDataField from "./OperationComponents/StudentOutreachDataField";
import Upskillingdatafield from "./OperationComponents/Upskillingdatafield";
// import Dtesamarthdatafield from "./OperationComponents/Dtesamarthdatafield";
import Alumuniqueriesdata from "./OperationComponents/Alumuniqueriesdata";
import CollegePitchdata from "./OperationComponents/CollegePitchdata";
import AllumuniBulkAdd from "./OperationComponents/AllumuniBulkAdd";
import CollegepitchesBulkadd from "./OperationComponents/CollegepitchesBulkadd";
import OpsSearchDropdown from "./OperationComponents/OpsSearchBar";
import UpskillSearchBar from "./OperationComponents/UpskillSearchBar";
import TotSearchBar from "./OperationComponents/TotSearchBar";
import CollegePitchSearch from "./OperationComponents/CollegePitchSearch";
import AlumniSearchBar from "./OperationComponents/AlumniSearchBar";
import EcosystemSearchBar from "./layout/EcosystemSearchBar";
import {
  sortAscending,
  resetSearch,
  searchOperationTab,
} from "../../store/reducers/Operations/actions";
import {
  bulkCreateAlumniQueries,
  bulkCreateCollegePitch,
  bulkCreateMentorship,
  bulkCreateStudentsUpskillings,
  bulkCreateUsersTots,
  bulkCreateStudentOutreach,
  bulkCreateEcosystem,
  bulkCreateCurriculumIntervention,
  getTotPickList
} from "./OperationComponents/operationsActions";
// import UploadFile from "./OperationComponents/UploadFile";
import { FaDownload, FaFileUpload, FaPlus } from "react-icons/fa";
import UploadFile from "./OperationComponents/UploadFile";
import TotUpload from "./UploadFiles/TOT/TotUpload";
import MentorshipdataField from "./OperationComponents/Mentorship/MentorshipdataField";
import MentorBulkAdd from "./OperationComponents/Mentorship/MentorBulkAdd";
import MentorshipSearchbar from "./OperationComponents/Mentorship/MentorshipSearchbar";
import AddStudentOutreach from "./OperationComponents/StudentOutreach/AddStudentOutreach";
import EcosystemBulkAdd from "./SaModule/Ecosystem/EcosystemBulkAdd";
import { createLatestAcivity } from "src/utils/LatestChange/Api";
import MentorshipUpload from "./UploadFiles/MentorShip/MentorshipUpload";
import UpskillUpdate from "./OperationComponents/UpskillUpdate";
import UpskillingUpload from "./UploadFiles/Upskilling/UpskillingUpload";
import PitchingUpload from "./UploadFiles/Pitching/PitchingUpload";
import StudentOutreachSearchBar from "./OperationComponents/studentOutreachSearchBar";
// import { createLatestAcivity } from "src/utils/LatestChange/Api";
import EcosystemDataField from "./SaModule/Ecosystem/EcosystemDataField"
import CurriculumInterventionSearchBar from "./SaModule/CurriculumIntervention/CurriculumInterventionSearchBar";
import CurriculumInterventionDataField from "./SaModule/CurriculumIntervention/CurriculumInterventionDataField";
import CurriculumInterventionBulkAdd from "./SaModule/CurriculumIntervention/CurriculumInterventionBulkAdd";
import QueryUpload from "./UploadFiles/AlumniQuery/QueryUpload";

const tabPickerOptionsMain = [
  { title: "Core Programs", key: "coreProgramme" },
  { title: "Alumni", key: "alum" },
  { title: "System Adoption", key: "systemAdoption" },
];

const tabPickerOptions1 = [
  { title: "Field Activities", key: "my_data" },
  { title: "Student Upskilling", key: "upskilling" },
  { title: "Pitching", key: "collegePitches" },
  { title: "Mentorship", key: "mentorship" },
];
const tabPickerOptions2 = [{ title: "Alumni Queries", key: "alumniQueries" }];
const tabPickerOptions3 = [
  { title: "TOT", key: "useTot" },
  {title:"Ecosystem", key:'ecosystem'},
  {title:"Career Progression", key: "career_progression"},
  { title: "Student Outreach", key: "studentOutreach" },
  { title: "Curriculum Intervention", key: "curriculumIntervention" }
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
    .ml-2 {
      margin-left: 1.2rem;
    }
  }
`;

const totfile = `https://medhasisstg.s3.ap-south-1.amazonaws.com/ToT-Template.xlsx`;
const feildActivityFIle ="https://medhasisstg.s3.ap-south-1.amazonaws.com/Field-Activities-Template.xlsx";
const mentorshipFile ="https://medhasisstg.s3.ap-south-1.amazonaws.com/Field-Activities-Template.xlsx";

const Operations = ({
  opsData,
  setAlert,
  sortAscending,
  resetSearch,
  isFound,
  isSearching,
  searchOperationTab,
}) => {
  const [showModal, setShowModal] = useState({
    opsdata: false,
    totdata: false,
    studentOutreachData: false,
    upskilldata: false,
    sditdata: false,
    alumniQueriesdata: false,
    collegePitches: false,
    mentorship: false,
    ecosystemData:false
  });
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState([]);
  const [optsdata, setOptsdata] = useState({
    opsdata: {},
    totdata: {},
    studentOutreachData: {},
    upskilldata: {},
    sditdata: {},
    alumniQueriesdata: {},
    collegePitches: {},
    mentorship: {},
    ecosystemData:{}
  });
  
  const [optsAggregate, setoptsAggregate] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState("list");
  const [activeTabMain, setActiveTabMain] = useState(tabPickerOptionsMain[0]);
  const [activeTab, setActiveTab] = useState(tabPickerOptions1[0]);
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const [searchedData, setSearchedData] = useState([]);
  const [updatedUrl,setupdatedUrl]=useState(totfile)
  const [uploadModal, setUploadModal] = useState({
    myData: false,
    tot: false,
    mentorship: false,
    upskill: false,
    pitching: false,
    ecosystem: false,
    curriculumIntervention: false,
  });
  // console.log("uploadModal",uploadModal);
  const userId = localStorage.getItem("user_id");

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
        Header: "Program Name",
        accessor: "program_name",
      },
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
      {
        Header:"Gender",
        accessor:"gender"
      }
    ],
    []
  );

  const columnsEcosystem = useMemo(() => [
  {
    Header: "Activity Type",
    accessor: "activity_type",
  },
  {
    Header: "Date of Activity",
    accessor: "date_of_activity",
    Cell: ({ value }) => value ? new Date(value).toLocaleDateString("en-IN") : "",
  },
  {
    Header: "Type of Partner",
    accessor: "type_of_partner",
  },
   {
    Header: "Topic",
    accessor: "topic",
  },
  {
    Header: "Total Students Attended",
    accessor: "attended_students",
  },
  {
    Header: "Male Participants",
    accessor: "male_participants",
  },
  {
    Header: "Female Participants",
    accessor: "female_participants",
  },
  {
    Header: "Medha POC 1",
    accessor: "medha_poc_1.username",
  },
  {
    Header: "Medha POC 2",
    accessor: "medha_poc_2.username",
  },
], []);


  

  const columnsMentor = useMemo(
    () => [
      {
        Header: "Mentor Name",
        accessor: "mentor_name",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.username",
      },
      {
        Header: "Mentor's Domain",
        accessor: "mentor_domain",
      },

      {
        Header: "Mentor's Area",
        accessor: "mentor_area",
      },

      {
        Header: "Mentor's State",
        accessor: "mentor_state",
      },
      {
        Header: "Program Name",
        accessor: "program_name",
      },
      {
        Header: "Mentor's Company",
        accessor: "mentor_company_name",
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
        Header: "Category",
        accessor: "category",
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
        Header: "Program Name",
        accessor: "program_name",
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
      {
        Header: "Program Name",
        accessor: "program_name",
      },
    ],
    []
  );
  const columnsCurriculumIntervention = useMemo(() => [
    { Header: "Module Created For", accessor: "module_created_for" },
    { Header: "Module Developed / Revised", accessor: "module_developed_revised" },
    { Header: "Start Date", accessor: "start_date" },
    { Header: "End Date", accessor: "end_date" },
    { Header: "Module Name", accessor: "module_name" },
    { Header: "Govt. Department Partnered With", accessor: "govt_dept_partnered_with" },
    { Header: "Medha POC", accessor: "medha_poc.username" },
    { Header: "Assigned To", accessor: "assigned_to.username" },
    { Header: "Created At", accessor: "created_at" },
    { Header: "Updated At", accessor: "updated_at" },
    { Header: "Created By", accessor: "created_by.username" },
    { Header: "Updated By", accessor: "updated_by.username" },
  ], []);
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
      isActive: true,
    };
   
    if (activeTab.key === "my_data") {
      await resetSearch();
      await api
        .post("/graphql", {
          query: GET_OPERATIONS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.activeOperations.values);
          setoptsAggregate(data.data.data.activeOperations.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }

    if(activeTab.key === "ecosystem") {
            await resetSearch();
             variables.isactive = true;
              delete variables.isActive;
          await api
        .post("/graphql", {
          query: GET_ECOSYSTEM_DATA,
          variables,
        })
        .then((data) => {
          setOpts(()=>{
            if(data?.data?.data?.activeEcosystemData) {
              return data.data.data.activeEcosystemData.values;
            }
            return [];
          });
          setoptsAggregate(()=>{
            if(data?.data?.data?.activeEcosystemData) {
              return data.data.data.activeEcosystemData.aggregate;
            }
            return [];
          });
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });


    }
    if (activeTab.key === "useTot") {
      await resetSearch();
      variables.isactive = true;
      delete variables.isActive;
      variables.isactive = true;
      delete variables.isActive;
      await api
        .post("/graphql", {
          query: GET_USERSTOTS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.activeUserstots.values);
          setoptsAggregate(data.data.data.activeUserstots.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }

    if (activeTab.key === "studentOutreach") {
      await resetSearch();
      variables.isactive = true;
      delete variables.isActive;
      await api
        .post("/graphql", {
          query: GET_STUDENT_OUTREACHES,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.activeStudentOutreaches.values);
          setoptsAggregate(data.data.data.activeStudentOutreaches.aggregate);
        })
        .catch((error) => {
          console.error(
            "API Error:",
            error.response ? error.response.data : error.message
          );
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }

    if (activeTab.key === "upskilling") {
      await resetSearch();

      await api
        .post("/graphql", {
          query: GET_STUDENTS_UPSKILLINGS,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.activeStudentsUpskillings.values);
          setoptsAggregate(data.data.data.activeStudentsUpskillings.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    // if (activeTab.key === "dtesamarth") {
    //   await resetSearch();

    //   await api
    //     .post("/graphql", {
    //       query: GET_DTE_SAMARTH_SDITS,
    //       variables,
    //     })
    //     .then((data) => {
    //       setOpts(data.data.data.dteSamarthSditsConnection.values);
    //       setoptsAggregate(data.data.data.dteSamarthSditsConnection.aggregate);
    //     })
    //     .catch((error) => {
    //       return Promise.reject(error);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //       nProgress.done();
    //     });
    // }
    if (activeTab.key === "alumniQueries") {
      await resetSearch();

      await api
        .post("/graphql", {
          query: GET_ALUMNI_QUERIES,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.activeAlumniQueries.values);
          setoptsAggregate(data.data.data.activeAlumniQueries.aggregate);
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
          setOpts(data.data.data.activeCollegePitches.values);
          setoptsAggregate(data.data.data.activeCollegePitches.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    if (activeTab.key === "mentorship") {
      // await resetSearch();
      // sortBy = "created_at"
      variables.sort = `${"updated_at"}:${sortOrder}`;
      variables.sort = `${"updated_at"}:${sortOrder}`;
      await api
        .post("/graphql", {
          query: GET_MENTORSHIP,
          variables,
        })
        .then((data) => {
          setOpts(data.data.data.activeMentoshipData.values);
          setoptsAggregate(data.data.data.activeMentoshipData.aggregate);
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
    if (activeTab.key === "curriculumIntervention") {
      await resetSearch();
      variables.isactive = true;
      delete variables.isActive;
      await api
        .post("/graphql", {
          query: GET_CURRICULUM_INTERVENTIONS,
          variables,
        })
        .then((data) => {
          // console.log(data?.data?.data?.activeCurriculumInterventions.values)
          setOpts(() => {
            if (data?.data?.data?.activeCurriculumInterventions) {
              return data.data.data.activeCurriculumInterventions.values;
            }
            return [];
          });
          // setoptsAggregate(() => {
          //   if (data?.data?.data?.activeCurriculumInterventions) {
          //     return data.data.data.activeCurriculumInterventions.aggregate;
          //   }
          //   return [];
          // });
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
      // console.log("activeTab", activeTab);
      if (activeTab.key === "my_data") {
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
      if (activeTab.key === "ecosystem") {
        if (sortBy.length) {
          let sortByField = "activity_type";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "activity_type":
            case "date_of_activity":
            case "type_of_partner":
            case "topic":
              sortByField = sortBy[0].id;
              break;

            default:
              sortByField = "activity_type";
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
      if (activeTab.key === "useTot") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "user_name":
            case "city":
            case "project_name":
            case "partner_dept":
            case "gender":
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
      if (activeTab.key === "upskilling") {
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
      if (activeTab.key === "curriculumIntervention") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
          switch (sortBy[0].id) {
            case "module_name":
            case "govt_dept_partnered_with":
            case "medha_poc":
              sortByField = sortBy[0].id;
              break;
            default:
              sortByField = "module_name";
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
      // if (activeTab.key == "dtesamarth") {
        // if (sortBy.length) {
        //   let sortByField;
        //   let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
        //   switch (sortBy[0].id) {
        //     case "student_name":
        //     case "institution_name":
        //     case "course_name":
        //       sortByField = sortBy[0].id;
        //       break;

      //       default:
      //         break;
      //     }

      //     getoperations(
      //       activeStatus,
      //       activeTab.key,
      //       pageSize,
      //       pageSize * pageIndex,
      //       sortByField,
      //       sortOrder
      //     );
      //   } else {
      //     getoperations(
      //       activeStatus,
      //       activeTab.key,
      //       pageSize,
      //       pageSize * pageIndex
      //     );
      //   }
      // }
      if (activeTab.key === "alumniQueries") {
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
      if (activeTab.key === "collegePitches") {
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
      if (activeTab.key === "mentorship") {
        if (sortBy.length) {
          let sortByField = "full_name";
          let sortOrder = sortBy[0].desc === true ? "desc" : "asc";


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
      setShowModal({ ...showModal, [key]: data });
      // return;
    }
  };

  //it refreshes table on saving event
  const refreshTableOnDataSaving = async () => {
    console.log("refreshTableOnDataSaving");
    if (isSearching) {
      const { baseUrl, searchedProp, searchValue } = await JSON.parse(
        localStorage.getItem("prevSearchedPropsAndValues")
      );
      await searchOperationTab(baseUrl, searchedProp, searchValue);
    } else {
      getoperations();
    }
  };

  //it refreshes table on delete event
  const refreshTableOnDeleting = async () => {
    if (isSearching) {
      const { baseUrl, searchedProp, searchValue } = await JSON.parse(
        localStorage.getItem("prevSearchedPropsAndValues")
      );
      await searchOperationTab(baseUrl, searchedProp, searchValue);
    } else {
      getoperations();
    }
  };

  const hideCreateModal = async (key, data) => {
    if (!data) {
      setModalShow(false);
      return;
    }
    let newValues = data.reduce((acc, obj) => {
    let newValues = data.reduce((acc, obj) => {
      const id = obj.id;
      acc[id] = obj;
      delete acc[id].id; // Optionally remove `id` from each object
      return acc;
    }, {});
    let datavaluesforlatestcreate = {};
    }, {});
    let datavaluesforlatestcreate = {};
    if (key == "feilddata") {
      datavaluesforlatestcreate = {
        module_name: "operations",
        activity: "Feild Data Created",
        event_id: "",
        updatedby: userId,
        changes_in: newValues,
      };

      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await api
        .post("/users-ops-activities/createBulkOperations", data)
        .then((data) => {
          setAlert("data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create field data .", "error");
        });
    }
    if (key == "alum") {
      datavaluesforlatestcreate = {
        module_name: "operations",
        activity: "Alumni Queries Data Created",
        event_id: "",
        updatedby: userId,
        changes_in: { name: "N/A" },
      };
      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await bulkCreateAlumniQueries(data)
        .then((data) => {
          setAlert("Alumni data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create alumni queries.", "error");
        });
    }
    if (key == "collegepitches") {
      datavaluesforlatestcreate = {
        module_name: "operations",
        activity: "college Pitches Data Created",
        event_id: "",
        updatedby: userId,
        changes_in: newValues,
      };

      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await bulkCreateCollegePitch(data)
        .then((data) => {
          setAlert("data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create pitching data.", "error");
        });
    }
    if (key == "upskill") {
      datavaluesforlatestcreate = {
        module_name: "operations",
        activity: "Upskiling Data Created",
        event_id: "",
        updatedby: userId,
        changes_in: newValues,
      };

      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await bulkCreateStudentsUpskillings(data)
        .then((data) => {
          setAlert("data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create upskilling data.", "error");
        });
    }

    if (key == "tot") {
      datavaluesforlatestcreate = {
        module_name: "operations",
        activity: "User Tot Data Created",
        event_id: "",
        updatedby: userId,
        changes_in: newValues,
      };

      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await bulkCreateUsersTots(data)
        .then((data) => {
          setAlert("data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create upskilling data.", "error");
        });
    }
    if (key == "studentOutreach") {
      const value = await bulkCreateStudentOutreach(data)
        .then((data) => {
          setAlert("data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create upskilling data.", "error");
        });
    }

    if (key == "mentorship") {
      datavaluesforlatestcreate = {
        module_name: "Operations",
        activity: "Mentorship Data Created",
        event_id: "",
        updatedby: userId,
        changes_in: newValues,
      };
      await createLatestAcivity(datavaluesforlatestcreate);
      const value = await bulkCreateMentorship(data)
        .then((data) => {
          setAlert("data created successfully.", "success");
          // history.push(`/student/${data.data.data.createStudent.student.id}`);
        })
        .catch((err) => {
          setAlert("Unable to create upskilling data.", "error");
        });
    }
    if (key === "ecosystem") {
      try {
          await bulkCreateEcosystem(data)
      }
      catch (error) {
        console.error("Error creating ecosystem data:", error);
        setAlert("Unable to create ecosystem data.", "error");
        return;
      }
    
    }
   
    if (key === "curriculum") {
      try{
        await bulkCreateCurriculumIntervention(data)
      }catch(error){
        console.error("Error creating curriculum intervention data:", error);
        setAlert("Unable to create curriculum intervention data.", "error");
        return;
      }
    }

    setModalShow(false);
    getoperations();
  };

  const showRowData = (key, data) => {
    console.log('Data being set for', key, ':', data); // Add this line
    setOptsdata({ ...optsdata, [key]: data });
    setShowModal({ ...showModal, [key]: true });
    if (key === "curriculumInterventionData") {
      setShowModal({ ...showModal, curriculumInterventionData: true });
      setOptsdata({ ...optsdata, curriculumInterventionData: data });
    }
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
    } catch (err) {}
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
      
      // Use opsData as the source for search results since that's where Redux stores the search results
      const dataSource = opsData;

      if (sortBy.length) {
        const { id, desc } = sortBy[0];
        desc ? descendingSort(id, dataSource) : ascendingSort(id, dataSource);
        arrangeRows(startFrom);
      } else {
        for (let element = 0; element < pageSize; element++) {
          if (element + 1 > dataSource.length) {
            break;
          }
          if (dataSource[startFrom]) {
            filteredArray.push(dataSource[startFrom]);
          }
          startFrom++;
        }
        setSearchedData(filteredArray);
      }
    },
    [opsData]
  );
  useEffect(() => {
    if (activeTabMain.key === "alum") {
      setActiveTab(tabPickerOptions2[0]);
    }

    if (activeTabMain.key === "systemAdoption") {
      setActiveTab(tabPickerOptions3[0]);
    }
    if (activeTabMain.key === "coreProgramme") {
      setActiveTab(tabPickerOptions1[0]);
    }
    if (
      activeTabMain.key !== "alum" &&
      activeTabMain.key !== "systemAdoption" &&
      activeTab.key !== "my_data"
    ) {
      window.location.reload();
    }
  }, [activeTabMain.key]);

  const uploadExcel = async (data, key) => {
    let newValues = data.reduce((acc, obj) => {
    let newValues = data.reduce((acc, obj) => {
      const id = obj.id;
      acc[id] = obj;
      delete acc[id].id; // Optionally remove `id` from each object
      return acc;
    }, {});
    let datavaluesforlatestcreate = {};
    }, {});
    let datavaluesforlatestcreate = {};
    try {
      if (key === "my_data") {
        datavaluesforlatestcreate = {
          module_name: "Operations",
          activity: "Field Activities Upload File",
          event_id: "",
          updatedby: userId,
          changes_in: { changes_in: { name: "N/A" } },
        };
        await createLatestAcivity(datavaluesforlatestcreate);
        await api.post("/users-ops-activities/createBulkOperations", data);
        setAlert("Data created successfully.", "success");
      }
      if (key === "tot") {
        datavaluesforlatestcreate = {
          module_name: "Operations",
          activity: "User-Tot Upload File",
          event_id: "",
          updatedby: userId,
          changes_in: { changes_in: { name: "N/A" } },
        };
        await createLatestAcivity(datavaluesforlatestcreate);
        await bulkCreateUsersTots(data)
          .then(() => {
            setAlert("data created successfully.", "success");
          })
          .catch((err) => {
            setAlert("Unable to create TOT data.", "error");
          });
      }
      if (key === "mentorship") {
        datavaluesforlatestcreate = {
          module_name: "Operations",
          activity: "Mentorship Upload File",
          event_id: "",
          updatedby: userId,
          changes_in: { changes_in: { name: "N/A" } },
        };
        await createLatestAcivity(datavaluesforlatestcreate);
        await bulkCreateMentorship(data)
          .then(() => {
            setAlert("data created successfully.", "success");
          })
          .catch((err) => {
            setAlert("Unable to create Mentorship data.", "error");
          });
      }
      if (key === "alumniQuery") {
        // datavaluesforlatestcreate = {
        //   module_name: "Operations",
        //   activity: "Field Activities Upload File",
        //   event_id: "",
        //   updatedby: userId,
        //   changes_in: { changes_in: { name: "N/A" } },
        // };
        // await createLatestAcivity(datavaluesforlatestcreate);
        await api.post("/alumni-queries/create-bulk-alumni-queries", data);
        setAlert("Data created successfully.", "success");
      }

      if (key === "pitching") {
        datavaluesforlatestcreate = {
          module_name: "Operations",
          activity: "College Pitching Upload File",
          event_id: "",
          updatedby: userId,
          changes_in: { changes_in: { name: "N/A" } },
        };
        await createLatestAcivity(datavaluesforlatestcreate);
        await bulkCreateCollegePitch(data)
          .then(() => {
            setAlert("data created successfully.", "success");
          })
          .catch((err) => {
            setAlert("Unable to create Mentorship data.", "error");
          });
      }
      if (key === "upskilling") {
        datavaluesforlatestcreate = {
          module_name: "Operations",
          activity: "Students Upskilling Upload File",
          event_id: "",
          updatedby: userId,
          changes_in: { changes_in: { name: "N/A" } },
        };
        await createLatestAcivity(datavaluesforlatestcreate);
        await bulkCreateStudentsUpskillings(data)
          .then(() => {
            setAlert("data created successfully.", "success");
          })
          .catch((err) => {
            setAlert("Unable to create Mentorship data.", "error");
          });
      }
      if (key == "studentOutreach") {
        const value = await bulkCreateStudentOutreach(data)
          .then((data) => {
            setAlert("data created successfully.", "success");
            // history.push(`/student/${data.data.data.createStudent.student.id}`);
          })
          .catch((err) => {
            setAlert("Unable to create TOT data.", "error");
          });
      }


     
      getoperations();
    } catch (err) {
      if (key === "my_data") {
        setAlert("Unable to create field data.", "error");
      } else if (key === "tot") {
        setAlert("Unable to create upskilling data.", "error");
      }
    } finally {
      // setUploadModal(false);
      getoperations();
    }
  };

  const alertForNotuploadedData = async (key) => {
    if (key == "feild_activity") {
      setUploadModal(false);
      // setAlert("There are some issue in your file please check", "error");
    } else {
      setUploadModal(false);
      // setAlert("There are some issue in your file please check", "error");
    }
  };
  const closeUpload = () => {
    setUploadModal(false);
  };

  const openclosepopup = () => {
    if (activeTab.key == "my_data") {
      setUploadModal({
        myData: true,
        tot: false,
        mentorship: false,
        upskill: false,
        pitching: false,
        alumniQueries: false,
      });
    }
    if (activeTab.key == "useTot") {
      setUploadModal({
        tot: true,
        myData: false,
        mentorship: false,
        upskill: false,
        alumniQueries: false,
        pitching: false,
      });
    }
     if (activeTab.key == "alumniQueries") {
      setUploadModal({
        tot: false,
        alumniQueries: true,
        myData: false,
        mentorship: false,
        upskill: false,
        pitching: false,
      });
    }
    if (activeTab.key == "mentorship") {
      setUploadModal({
        tot: false,
        myData: false,
        alumniQueries: false,
        mentorship: true,
        upskill: false,
        pitching: false,
      });
    }
    if (activeTab.key == "upskilling") {
      setUploadModal({
        tot: false,
        myData: false,
        mentorship: false,
        pitching: false,
        alumniQueries: false,
        upskill: true,
      });
    }
    if (activeTab.key == "collegePitches") {
      setUploadModal({
        tot: false,
        myData: false,
        mentorship: false,
        upskill: false,
        alumniQueries: false,
        pitching: true,
      });
    }
  };
   const updateToturl=(url)=>{
    setupdatedUrl(url)
  } 
  const handleDownload = async (retries = 3) => {
    const fileUrl = updatedUrl;
    console.log(updateToturl);
    
    const customFileName = "ToT-Template.xlsx";

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = customFileName;
            link.click();
            window.URL.revokeObjectURL(blobUrl);
            
            console.log("Download successful");
            return; // Success, exit function
        } catch (err) {
            console.error(`Attempt ${i + 1} failed:`, err);
            if (i === retries - 1) throw err; // If last attempt, rethrow error
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
    }
};
useEffect(async() => {

  let data = await getTotPickList();
  setupdatedUrl(data.totLink[0]);
}, [])


const handleDownloadClick =()=>{
  SampleFile()
  
}
  const SampleFile = () => {
   

    switch (activeTab.key) {
      case "my_data":
        return 'https://medhasisstg.s3.ap-south-1.amazonaws.com/Field-Activities-Template.xlsx';
      // case "useTot":
      //   return totfile;
       case "useTot":
        handleDownload();   // trigger download
        return "";  
      case "mentorship":
        return "https://medhasisstg.s3.ap-south-1.amazonaws.com/Mentorship-Template.xlsx";
      case "upskilling":
        return "https://medhasisstg.s3.ap-south-1.amazonaws.com/Student+Upskilling+Template.xlsx";
      case "collegePitches":
        return "https://medhasisstg.s3.ap-south-1.amazonaws.com/Pitching+Template.xlsx";

      case "alumniQueries":
        return "https://medhasisstg.s3.ap-south-1.amazonaws.com/Alumni+Queries+Template.xlsx";
      default:
        return ""; // Fallback in case the tab doesn't match
    }
  };
 
  const columnsStudentOutreach = useMemo(
    () => [
      {
        Header: "Financial Year",
        accessor: "year_fy",
        width: 120 // Fixed width in pixels
      },
      {
        Header: "Quarter",
        accessor: "quarter",
        width: 80
      },
      {
        Header: "Month",
        accessor: "month",
        width: 100
      },
      {
        Header: "Category",
        accessor: "category",
        width: 200,
        cell: ({ value }) => (
          <div style={{
            width: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {value}
          </div>
        )
      },
      {
        Header: "State",
        accessor: "state",
        width: 120
      },
      {
        Header: "Department",
        accessor: "department",
        width: 100
      },
      {
        Header: "Students",
        accessor: "students",
        width: 100
      },
    ],
    []
  );
 

  return (
    <Collapse title="OPERATIONS" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          <div className="d-flex flex-column flex-md-row justify-content-between  align-items-center mb-2 p-0">
            <TabPicker
              options={tabPickerOptionsMain}
              setActiveTab={setActiveTabMain}
            />
            {activeTabMain.key === "coreProgramme" ? (
              <TabPicker
                options={tabPickerOptions1}
                setActiveTab={setActiveTab}
              />
            ) : activeTabMain.key === "alum" ? (
              <TabPicker
                options={tabPickerOptions2}
                setActiveTab={setActiveTab}
              />
            ) : activeTabMain.key === "systemAdoption" ? (
              <TabPicker
                options={tabPickerOptions3}
                setActiveTab={setActiveTab}
              />
            ) : (
              ""
            )}
            <div className="d-flex flex-md-row justify-content-between align-items-center mb-2">
              {(isSRM() || isAdmin() || isMedhavi()) && (
                <>
                  <button
                    className="btn btn-primary ops_action_button"
                    onClick={() => setModalShow(true)}
                  >
                    Add{" "}
                    <span>
                      <FaPlus size="12" color="#fff" />
                    </span>
                  </button>
                {console.log(activeTab.key)
                }
                  {activeTab.key == "my_data" ||
                  activeTab.key == "useTot" ||
                  activeTab.key == "mentorship" ||
                  activeTab.key == "upskilling" ||
                  activeTab.key == "collegePitches" || activeTab.key =="alumniQueries"
                   ? (
                    <button
                      className="btn btn-primary ops_action_button"
                      onClick={() => {
                        openclosepopup();
                      }}
                    >
                      Upload &nbsp;
                      <span>
                        <FaFileUpload size="12" color="#fff" />
                      </span>
                    </button>
                  ) : (
                    ""
                  )}
                  {activeTab.key == "my_data" ||
                  activeTab.key == "useTot" ||
                  activeTab.key == "mentorship" ||
                  activeTab.key == "upskilling" ||
                  activeTab.key =="alumniQueries" || 
                  activeTab.key == "collegePitches" ? (
                    <button className="btn btn-primary ops_action_button">
                      <div>
                        <a
                          href={activeTab.key === "useTot" ? "#" : SampleFile()}
                          target="_blank"
                          className="c-pointer mb-1 d-block text-light text-decoration-none downloadLink"
                          onClick={handleDownloadClick}
                        >
                          Sample&nbsp;
                          <span>
                            <FaDownload size="12" color="#fff" />
                          </span>
                        </a>
                      </div>
                    </button>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>

          <div className={`${layout !== "list" ? "d-none" : "p-0"}`}>
            {activeTab.key === "my_data" ? (
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
                  // allDataCount={optsAggregate.count}
                />
              </>
            ) : activeTab.key == "studentOutreach" ? (
              <>
                <StudentOutreachSearchBar />
                <Table
                  onRowClick={(data) =>
                    showRowData("studentOutreachData", data)
                  }
                  columns={columnsStudentOutreach}
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
            ):activeTab.key === "ecosystem" ? (
              <>
                <EcosystemSearchBar />
              <Table
                  onRowClick={(data) => showRowData("ecosystemData", data)}
                  columns={columnsEcosystem}
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
            )
            
            : activeTab.key == "upskilling" ? (
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
            ) 
            // : activeTab.key == "dtesamarth" ? (
            //   <></>
            // ) 
            : activeTab.key == "alumniQueries" ? (
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
            ) : activeTab.key == "mentorship" ? (
              <>
                <MentorshipSearchbar />
                <Table
                  onRowClick={(data) => showRowData("mentorship", data)}
                  columns={columnsMentor}
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
            ) : activeTab.key === "curriculumIntervention" ? (
              <>
                <CurriculumInterventionSearchBar />
                <Table
                  onRowClick={(data) => showRowData("curriculumInterventionData", data)}
                  columns={columnsCurriculumIntervention}
                  data={isSearching ? (isFound ? searchedData : []) : opts}
                  totalRecords={isSearching ? opsData.length : optsAggregate.count}
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
        { /* Modal for Create Operation Form */ }
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          {activeTab.key == "my_data" ? (
            (isSRM() || isAdmin() || isMedhavi()) && (
              <OperationCreateform
                show={modalShow}
                onHide={hideCreateModal}
                ModalShow={() => setModalShow(false)}
              />
            )
          ) : // useTot  ---upskilling ---dtesamarth
          
          activeTab.key == "useTot" ? (
            (isSRM() || isAdmin() || isMedhavi()) && (
              <UserTot
                show={modalShow}
                onHide={hideCreateModal}
                ModalShow={() => setModalShow(false)}
              />
            )
          ) : activeTab.key == "studentOutreach" ? (
            (isSRM() || isAdmin() || isMedhavi()) && (
              <AddStudentOutreach
                show={modalShow}
                onHide={hideCreateModal}
                ModalShow={() => setModalShow(false)}
              />
            )
          ) : activeTab.key == "upskilling" ? (
            (isSRM() || isAdmin() || isMedhavi()) && (
              <StudentUpkillingBulkcreate
                show={modalShow}
                onHide={hideCreateModal}
                ModalShow={() => setModalShow(false)}
              />
            )
          ) 
          // : activeTab.key == "dtesamarth" ? (
          //   (isSRM() || isAdmin() || isMedhavi()) && (
          //     <Dtesamarth
          //       show={modalShow}
          //       onHide={hideCreateModal}
          //       ModalShow={() => setModalShow(false)}
          //     />
          //   )
          // ) 
          : activeTab.key == "alumniQueries" ? (
            (isSRM() || isAdmin() || isMedhavi()) && (
              <AllumuniBulkAdd
                show={modalShow}
                onHide={hideCreateModal}
                ModalShow={() => setModalShow(false)}
              />
            )
          ) : activeTab.key == "collegePitches" ? (
            (isSRM() || isAdmin() || isMedhavi()) && (
              <CollegepitchesBulkadd
                show={modalShow}
                onHide={hideCreateModal}
                ModalShow={() => setModalShow(false)}
              />
            )
          ) : activeTab.key == "mentorship" ? (
            <MentorBulkAdd
              show={modalShow}
              onHide={hideCreateModal}
              ModalShow={() => setModalShow(false)}
            />
          ) : activeTab.key === "ecosystem" ? (
            <EcosystemBulkAdd
              show={modalShow}
              onHide={hideCreateModal}
              ModalShow={() => setModalShow(false)}
            />
          ) : activeTab.key === "curriculumIntervention" ? (
            <CurriculumInterventionBulkAdd
              show={modalShow}
              onHide={hideCreateModal}
              ModalShow={() => setModalShow(false)}
              refreshTableOnDataSaving={refreshTableOnDataSaving}
            />
          ):(
            ""
          )}
          {showModal.opsdata && (isSRM() || isAdmin() || isMedhavi()) && (
            <Opsdatafeilds
              {...optsdata.opsdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("opsdata", false)}
              refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
              refreshTableOnDeleting={() => refreshTableOnDeleting()}
            />
          )}
          {showModal.totdata && (isSRM() || isAdmin() || isMedhavi()) && (
            <Totdatafield
              {...optsdata.totdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("totdata", false)}
              refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
              refreshTableOnDeleting={() => refreshTableOnDeleting()}
            />
          )}
          {
           showModal.ecosystemData && (isSRM() || isAdmin() || isMedhavi()) && (
            <EcosystemDataField
            {...optsdata.ecosystemData}
              show={showModal.ecosystemData}
              onHide={() => hideShowModal("ecosystemData", false)}
              refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
              refreshTableOnDeleting={() => refreshTableOnDeleting()}
            />
           )
          }
          
          {showModal.upskilldata && (isSRM() || isAdmin() || isMedhavi()) && (
            <Upskillingdatafield
              {...optsdata.upskilldata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("upskilldata", false)}
              refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
              refreshTableOnDeleting={() => refreshTableOnDeleting()}
            />
          )}
          {/* {showModal.sditdata && (isSRM() || isAdmin() || isMedhavi()) && (
            <Dtesamarthdatafield
              {...optsdata.sditdata}
              show={showModal.opsdata}
              onHide={() => hideShowModal("sditdata", false)}
            />
          )} */}
          {showModal.alumniQueriesdata &&
            (isSRM() || isAdmin() || isMedhavi()) && (
              <Alumuniqueriesdata
                {...optsdata.alumniQueriesdata}
                show={showModal.opsdata}
                onHide={() => hideShowModal("alumniQueriesdata", false)}
                refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
                refreshTableOnDeleting={() => refreshTableOnDeleting()}
              />
            )}
          {showModal.collegePitches &&
            (isSRM() || isAdmin() || isMedhavi()) && (
              <CollegePitchdata
                {...optsdata.collegePitches}
                show={showModal.opsdata}
                onHide={() => hideShowModal("collegePitches", false)}
                refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
                refreshTableOnDeleting={() => refreshTableOnDeleting()}
              />
            )}
          {showModal.mentorship && (isSRM() || isAdmin() || isMedhavi()) && (
            <MentorshipdataField
              {...optsdata.mentorship}
              show={showModal.opsdata}
              onHide={() => hideShowModal("mentorship", false)}
              refreshTableOnDataSaving={() => refreshTableOnDataSaving()}
              refreshTableOnDeleting={() => refreshTableOnDeleting()}
            />
          )}
          {showModal.curriculumInterventionData && (
            <CurriculumInterventionDataField
              {...optsdata.curriculumInterventionData}
              show={showModal.curriculumInterventionData}
              onHide={() => setShowModal({ ...showModal, curriculumInterventionData: false })}
              refreshTableOnDataSaving={refreshTableOnDataSaving}
              refreshTableOnDeleting={refreshTableOnDeleting}
            />
          )}
          {uploadModal.myData && (
            <>
              <UploadFile
                uploadExcel={uploadExcel}
                alertForNotuploadedData={alertForNotuploadedData}
                closeThepopus={closeUpload}
              />
            </>
          )}
          {uploadModal.tot && (
            <>
              <TotUpload
                updateToturl={updateToturl}
                uploadExcel={uploadExcel}
                alertForNotuploadedData={alertForNotuploadedData}
                closeThepopus={closeUpload}
                tot="yes"
              />
            </>
          )}

          {uploadModal.mentorship && (
            <>
              <MentorshipUpload
                uploadExcel={uploadExcel}
                // alertForNotuploadedData={alertForNotuploadedData}
                closeThepopus={() => closeUpload()}
                mentorship="yes"
              />
            </>
          )}

          {uploadModal.upskill && (
            <>
              <UpskillingUpload
                uploadExcel={uploadExcel}
                alertForNotuploadedData={alertForNotuploadedData}
                closeThepopus={() => closeUpload()}
                Upskill="yes"
              />
            </>
          )}

          {uploadModal.alumniQueries && (
            <>
              <QueryUpload
                uploadExcel={uploadExcel}
                alertForNotuploadedData={alertForNotuploadedData}
                closeThepopus={() => closeUpload()}
                AlumniQuery="yes"
              />
            </>
          )}

          {uploadModal.pitching && (
            <>
              <PitchingUpload
                uploadExcel={uploadExcel}
                // alertForNotuploadedData={alertForNotuploadedData}
                closeThepopus={() => closeUpload()}
                Pitching="yes"
              />
            </>
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
  searchOperationTab,
};

export default connect(mapStateToProps, mapActionsToProps)(Operations);