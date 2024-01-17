import nProgress from "nprogress";
import styled from "styled-components";
import api from "../../apis";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
  uploadFile,
} from "../../components/content/Utils";
import moment from "moment";
import { connect } from "react-redux";
import Avatar from "../../components/content/Avatar";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { GET_STUDENTS } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from "../../components/content/Table";
import {
  getStudentsPickList,
  createStudent,
} from "./StudentComponents/StudentActions";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from "@material-ui/core/Switch";
import StudentGrid from "./StudentComponents/StudentGrid";
import { studentStatusOptions } from "./StudentComponents/StudentConfig";
import StudentForm from "./StudentComponents/StudentForm";
import Collapse from "../../components/content/CollapsiblePanels";
import { isAdmin, isSRM } from "../../common/commonFunctions";
import MassEdit from "./StudentComponents/MassEdit";
import MassEmployerUpload from "./StudentComponents/MassEmployerUpload";
import { isEmptyArray } from "formik";
import StudentsSearchBar from "./StudentComponents/StudentsSearchBar";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
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

const Students = (props) => {
  let { isSidebarOpen, batch } = props;
  const { setAlert } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [modalShow2, setModalShow2] = useState(false);
  const [layout, setLayout] = useState("list");
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [activeStatus, setActiveStatus] = useState("All");
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable,setIsSearchEnable] = useState(false);
  const [selectedSearchedValue,setSelectedSearchedValue] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "avatar",
      },
      {
        Header: "Student ID",
        accessor: "student_id",
      },
      {
        Header: "Area",
        accessor: "medha_area",
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Registration Date",
        accessor: "registration_date",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.username",
      },
    ],
    []
  );




  useEffect(()=>{
    if(isSearchEnable){
      getStudents()
    }
    

  },[isSearchEnable])

  const getStudentsBySearchFilter = async(status="All",selectedTab,limit=paginationPageSize,offset=0,selectedSearchedValue,selectedSearchField,sortBy,sortOrder)=>{
    const studentFields = `
    id
    full_name
    email
    phone
    alternate_phone
    status
    name_of_parent_or_guardian
    date_of_birth
    category
    gender
    registration_date_latest
    certification_date_latest
    internship_date_latest
    placement_date_latest
    course_type_latest
    income_level
    family_annual_income
    old_sis_id
    medha_champion
    interested_in_employment_opportunities
    city
    pin_code
    medha_area
    address
    state
    how_did_you_hear_about_us
    how_did_you_hear_about_us_other
    created_at
    updated_at
    created_by_frontend{
      email
      username
    }
    updated_by_frontend{
      username
      email
    }
    district
    student_id
    assigned_to{
      id
      username
      email
      area
    }
    registered_by{
      id
      username
      email
    }
    logo {
      id
      url
    }
    CV {
      id
      url
      previewUrl
      updated_at
    }
  `;

  let variables = {
    limit,
    start:offset,
    sort: `${sortBy ? sortBy:selectedSearchField}:${sortOrder?sortOrder:"asc"}`
  }

  if (status !== "All") {
    variables.status = studentStatusOptions.find(
      (tabStatus) => tabStatus.title?.toLowerCase() === status.toLowerCase()
    )?.picklistMatch;
  }
  if (selectedTab === "my_data") {
    Object.assign(variables, { id: userId });
  } else if (selectedTab === "my_state") {
    Object.assign(variables, { state: state });
  } else if (selectedTab === "my_area") {
    Object.assign(variables, { area: area });
  }
  else if(selectedSearchField === "medha_area"){
    Object.assign(variables, { area: selectedSearchedValue.trim()});
  }
  else {
    variables[selectedSearchField] = selectedSearchedValue.trim();
  }

  

const StudentQuery = `query GET_STUDENTS($id: Int, $limit: Int, $start: Int, $sort: String, $status:String, $state:String, $area:String, ${selectedSearchField === 'medha_area'|| selectedSearchField === 'status'?'':`$${selectedSearchField}:String`}) {
    studentsConnection (
      sort: $sort
      start: $start
      limit: $limit,
      where: {
        assigned_to: {
          id: $id
        },
        medha_area: $area
        state:$state,
        status:$status,
        ${selectedSearchField === 'medha_area' || selectedSearchField === 'status'?'':`${selectedSearchField}:$${selectedSearchField}`}
      }
    ) {
      values {
        ${studentFields}
      }
      aggregate {
        count
      }
    }
  }`


   
  await api
    .post("/graphql", {
      query: StudentQuery,
      variables,
    })
    .then((data) => {

      setStudents(data?.data?.data?.studentsConnection.values);
      setStudentsAggregate(data?.data?.data?.studentsConnection?.aggregate);
    })
    .catch((error) => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
      nProgress.done();
    });
  }
 
  const getStudents = async (
    status = "All",
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {

    nProgress.start();
    setLoading(true);

if(isSearchEnable){
  await getStudentsBySearchFilter(status,selectedTab,limit,offset,selectedSearchedValue,selectedSearchField);

}
else {
  let variables = {
    limit,
    start: offset,
    sort: `${sortBy}:${sortOrder}`,
  };
  if (status !== "All") {
    variables.status = studentStatusOptions.find(
      (tabStatus) => tabStatus.title?.toLowerCase() === status.toLowerCase()
    )?.picklistMatch;
  }
  if (selectedTab == "my_data") {
    Object.assign(variables, { id: userId });
  } else if (selectedTab == "my_state") {
    Object.assign(variables, { state: state });
  } else if (selectedTab == "my_area") {
    Object.assign(variables, { area: area });
  }

  
  await api
    .post("/graphql", {
      query: GET_STUDENTS,
      variables,
    })
    .then((data) => {
      let value = data?.data?.data?.studentsConnection.values.map((obj) => {
        obj.full_name = obj.full_name.replace(/\b\w/g, (match) => {
          return match.toUpperCase();
        });
      });

      setStudents(data?.data?.data?.studentsConnection.values);
      setStudentsAggregate(data?.data?.data?.studentsConnection?.aggregate);
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

  const fetchData = useCallback(
    (pageIndex, pageSize, sortBy,isSearchEnable,selectedSearchedValue,selectedSearchField) => {
    
      if (sortBy.length) {
        let sortByField = "full_name";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";

        switch (sortBy[0].id) {
          case "status":
          case "phone":
          case "city":
          case "id":
          case "medha_area":
          case "student_id":
          case "assigned_to.username":
          case "course_type_latest":
            sortByField = sortBy[0].id;
            break;

          case "avatar":
          default:
            sortByField = "full_name";
            break;
        }
        if(isSearchEnable){
          getStudentsBySearchFilter(activeStatus,activeTab.key,pageSize,pageSize * pageIndex,selectedSearchedValue,selectedSearchField,sortByField,sortOrder)
        }
        else {
          getStudents(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
       
      } else {
        if(isSearchEnable){
          getStudentsBySearchFilter(activeStatus,activeTab.key,pageSize,pageSize * pageIndex,selectedSearchedValue,selectedSearchField)

        }else {
          getStudents(
            activeStatus,
            activeTab.key,
            pageSize,
            pageSize * pageIndex
          );
        }
      }
    },
    [activeTab.key, activeStatus]
  );

  useEffect(() => {
    getStudentsPickList().then((data) => setPickList(data));
    fetchData(0, paginationPageSize, []);
  }, []);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);

  useEffect(() => {
    if (students) {
      let data = students;
      data = data.map((student) => {
        let studentStatusData = studentStatusOptions.find(
          (status) =>
            status.picklistMatch?.toLowerCase() ===
            student?.status?.toLowerCase()
        );
        return {
          ...student,
          // assignedTo: <Anchor text={student.assigned_to?.username} href={'/user/' + student.assigned_to?.id} />,
          avatar: (
            <Avatar
              name={student.full_name}
              logo={student.logo}
              style={{ width: "35px", height: "35px" }}
              icon="student"
            />
          ),
          link: <TableRowDetailLink value={student.id} to={"student"} />,
          status: (
            <Badge value={student.status} pickList={pickList.status || []} />
          ),
          category: (
            <Badge
              value={student.category}
              pickList={pickList.category || []}
            />
          ),
          gender: (
            <Badge value={student.gender} pickList={pickList.gender || []} />
          ),
          statusIcon: studentStatusData?.icon,
          registration_date: student.registration_date_latest
            ? moment(student.registration_date_latest).format("DD MMM YYYY")
            : null,
          title: student.full_name,
          progressPercent: studentStatusData?.progress,
          href: `/student/${student.id}`,
        };
      });
      setStudentsData(data);
    }
  }, [students, pickList]);

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let { show, institution, batch, cv_file, ...dataToSave } = data;
    dataToSave["date_of_birth"] = data.date_of_birth
      ? moment(data.date_of_birth).format("YYYY-MM-DD")
      : "";
    if (typeof data.CV === "object") {
      dataToSave["CV"] = data.CV?.url;
    }

    if (cv_file) {
      uploadFile(data.cv_file)
        .then((data) => {
          dataToSave["CV"] = data.data.data.upload.id;
          createStudentApi(dataToSave);
        })
        .catch((err) => {
         
          setAlert("Unable to upload CV.", "error");
        });
    } else {
      createStudentApi(dataToSave);
    }
  };

  const createStudentApi = (dataToSave) => {
    nProgress.start();
    createStudent(dataToSave)
      .then((data) => {
        setAlert("Student created successfully.", "success");
        history.push(`/student/${data.data.data.createStudent.student.id}`);
      })
      .catch((err) => {
        
        setAlert("Unable to create student.", "error");
      })
      .finally(() => {
        nProgress.done();
        setStudents();
      });
    setModalShow(false);
  };

  const handleStudentStatusTabChange = (statusTab) => {
    setActiveStatus(statusTab.title);
    getStudents(
      statusTab.title,
      activeTab.key,
      paginationPageSize,
      paginationPageSize * paginationPageIndex
    );
  };


  const HideMassEmployeCreateModal =async(data)=>{
      if(data.length ==0){
        // return ;
        setAlert("Unable to create Employment Connection Data.", "error");
      }else{
        try {
          const response = await api.post(
            "/employment-connections/createBulkEmploymentConnection",
            data
          );
          setAlert("Employment Connection data created successfully.", "error");
        } catch (error) {
          setAlert("Unable to create Employment Connection Data.", "error");
        }
      }
  }

  const hideMassCreateModal = async (data) => {
    if(data.length ==0){
      setAlert("Unable to create Alumni Data.", "error");
    }
    else {
      try {
        const response = await api.post(
          "/alumni-services/createBulkAlumniServices",
          data
        );
        setAlert("Alumni data created successfully.", "success");
      } catch (error) {
        setAlert("Unable to create Alumni Data.", "error");
      }
    }
    
  };

  return (
    <Collapse title="STUDENTS" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          <div className="d-flex justify-content-end py-2">
            <FaThLarge
              size={22}
              color={layout === "grid" ? "#00ADEF" : "#787B96"}
              onClick={() => setLayout("grid")}
              className="c-pointer"
            />
            <Switch
              size="small"
              checked={layout === "list"}
              onChange={() => setLayout(layout === "list" ? "grid" : "list")}
              color="default"
            />
            <FaListUl
              size={22}
              color={layout === "list" ? "#00ADEF" : "#787B96"}
              onClick={() => setLayout("list")}
              className="c-pointer"
            />
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
            <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
            <Tabs
              options={studentStatusOptions}
              onTabChange={handleStudentStatusTabChange}
            />

          
            {(isSRM() || isAdmin()) && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setModalShow(true)}
                  style={{ marginLeft: "5px" }}
                >
                  Add New Student
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setModalShow1(true)}
                  //  style={{ marginLeft: "15px" }}
                >
                  Mass Alumni Service
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => setModalShow2(true)}
                  //  style={{ marginLeft: "10px" }}
                >
                  Mass Employer
                </button>
              </>
            )}
          </div>
          
          <StudentsSearchBar 
            selectedSearchField={selectedSearchField} 
            setSelectedSearchField={setSelectedSearchField} 
            setIsSearchEnable={setIsSearchEnable}
            setSelectedSearchedValue={setSelectedSearchedValue}
            tab={activeTab.key}
            info={{
              id:userId,
              area:area,
              state:state,
            }}
            />
          <div className={`${layout !== "list" ? "d-none" : ""}`}>
            <Table
              columns={columns}
              data={studentsData}
              totalRecords={studentsAggregate.count}
              fetchData={fetchData}
              loading={loading}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
              isSearchEnable={isSearchEnable}
              selectedSearchField={selectedSearchField}
              selectedSearchedValue={selectedSearchedValue}
            />
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          <div className={`col-12 ${layout !== "grid" ? "d-none" : ""}`}>
            <StudentGrid
              data={studentsData}
              isSidebarOpen={isSidebarOpen}
              totalRecords={studentsAggregate.count}
              fetchData={() => {}}
              paginationPageSize={paginationPageSize}
              onPageSizeChange={setPaginationPageSize}
              paginationPageIndex={paginationPageIndex}
              onPageIndexChange={setPaginationPageIndex}
            />
          </div>
          <StudentForm show={modalShow} onHide={hideCreateModal} />
          <MassEdit data={studentsData} show={modalShow1} onHide={hideMassCreateModal} />
          <MassEmployerUpload data={studentsData} show={modalShow2} onHide={HideMassEmployeCreateModal} />
        </div>
      </Styled>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Students);
