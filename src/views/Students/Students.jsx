import nProgress from "nprogress";
import styled from 'styled-components';
import api from "../../apis";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../components/content/Utils";
import moment from "moment";
import { connect } from "react-redux";
import Avatar from "../../components/content/Avatar";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { GET_STUDENTS } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from '../../components/content/Table';
import { getStudentsPickList, createStudent } from "./StudentComponents/StudentActions";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from '@material-ui/core/Switch';
import StudentGrid from "./StudentComponents/StudentGrid";
import {studentStatusOptions} from "./StudentComponents/StudentConfig";
import StudentForm from "./StudentComponents/StudentForm";
import Collapse from "../../components/content/CollapsiblePanels";
import { SignalCellularNull } from "@material-ui/icons";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Styled = styled.div`

  .MuiSwitch-root { // material switch
    margin-left: 5px;
    margin-right: 5px;

    .MuiSwitch-switchBase {
      color: #207B69;
    }
    .MuiSwitch-track {
      background-color: #C4C4C4;
      opacity: 1;
    }
  }
`;

const Students = (props) => {
  let { isSidebarOpen, batch  } = props;
  const {setAlert} = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState('list');
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const [activeStatus, setActiveStatus] = useState('All');
  const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);
  const userId = parseInt(localStorage.getItem('user_id'))
  const state = localStorage.getItem('user_state');
  const area = localStorage.getItem('user_area')

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'avatar',
      },
      {
        Header: 'Student ID',
        accessor: 'student_id',
      },
      {
        Header: 'Area',
        accessor: 'medha_area',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Registration Date',
        accessor: 'registration_date',
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
      },
    ],
    []
  );

  const getStudents = async (status ='All', selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {

    nProgress.start();
    setLoading(true);
    let variables = {
      limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    }
    if (status !== 'All') {
      variables.status = studentStatusOptions.find(tabStatus => tabStatus.title?.toLowerCase() === status.toLowerCase())?.picklistMatch;
    }
    if(selectedTab == "my_data"){
      Object.assign(variables, {id: userId})
    } else if(selectedTab == "my_state"){
      Object.assign(variables, {state: state})
    } else if(selectedTab == "my_area"){
      Object.assign(variables, {area: area})
    }

    await api.post("/graphql", {
      query: GET_STUDENTS,
      variables,
    })
    .then(data => {
      setStudents(data?.data?.data?.studentsConnection.values);
      setStudentsAggregate(data?.data?.data?.studentsConnection?.aggregate);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
      nProgress.done();
    });
  };

  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'full_name';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'status':
        case 'phone':
        case 'city':
        case 'id':
        case 'course_type_latest':
          sortByField = sortBy[0].id;
          break;

        case 'avatar':
        default:
          sortByField = 'full_name';
          break;
      }
      getStudents(activeStatus, activeTab.key, pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getStudents(activeStatus, activeTab.key, pageSize, pageSize * pageIndex);
    }
  }, [activeTab.key, activeStatus]);

  useEffect(() => {
    getStudentsPickList().then(data => setPickList(data));
    fetchData(0, paginationPageSize, []);
  }, []);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);

  useEffect(() => {
    if (students) {
      let data = students;
      data = data.map(student => {
        let studentStatusData = studentStatusOptions.find(status => status.picklistMatch?.toLowerCase() === student?.status?.toLowerCase());
        return {
          ...student,
          // assignedTo: <Anchor text={student.assigned_to?.username} href={'/user/' + student.assigned_to?.id} />,
          avatar: <Avatar name={student.full_name} logo={student.logo} style={{width: '35px', height: '35px'}} icon="student" />,
          link: <TableRowDetailLink value={student.id} to={'student'} />,
          gridLink: `/student/${student.id}`,
          status: <Badge value={student.status} pickList={pickList.status || []} />,
          category: <Badge value={student.category} pickList={pickList.category || []} />,
          gender: <Badge value={student.gender} pickList={pickList.gender || []} />,
          statusIcon: studentStatusData?.icon,
          registration_date: moment(student.created_at).format("DD MMM YYYY"),
          title: student.full_name,
          progressPercent: studentStatusData?.progress,
        }
      });
      setStudentsData(data);
    }
  }, [students, pickList]);

  const onRowClick = (row) => {
    history.push(`/student/${row.id}`)
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, institution, batch, ...dataToSave} = data;
    dataToSave['date_of_birth'] = data.date_of_birth ? moment(data.date_of_birth).format("YYYY-MM-DD") : '';
    if (typeof data.CV === 'object') {
      dataToSave['CV'] = data.CV?.url;
    }

    nProgress.start();
    createStudent(dataToSave).then(data => {
      setAlert("Student created successfully.", "success");
      history.push(`/student/${data.data.data.createStudent.student.id}`);
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create student.", "error");
    }).finally(() => {
      nProgress.done();
      setStudents();
    });
    setModalShow(false);
  };


  const handleStudentStatusTabChange = (statusTab) => {
    setActiveStatus(statusTab.title);
    getStudents(statusTab.title, activeTab.key, paginationPageSize, paginationPageSize * paginationPageIndex);
  }

  return (
    <Collapse title="STUDENTS" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          <div className="d-flex justify-content-end py-2">
            <FaThLarge size={22} color={layout === 'grid' ? '#00ADEF' : '#787B96'} onClick={() => setLayout('grid')} className="c-pointer" />
            <Switch size="small" checked={layout === 'list'} onChange={() => setLayout(layout === 'list' ? 'grid' : 'list')} color="default" />
            <FaListUl size={22} color={layout === 'list' ? '#00ADEF' : '#787B96'} onClick={() => setLayout('list')} className="c-pointer" />
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
            <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
            <Tabs options={studentStatusOptions} onTabChange={handleStudentStatusTabChange} />
            <button
              className="btn btn-primary"
              onClick={() => setModalShow(true)}
              style={{marginLeft: '15px'}}
            >
              Add New Student
            </button>
          </div>
          <div className={`${layout !== 'list' ? 'd-none' : ''}`}>
            <Table columns={columns} data={studentsData} totalRecords={studentsAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
          </div>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          <div className={`col-12 ${layout !== 'grid' ? 'd-none' : ''}`}>
            <StudentGrid data={studentsData} isSidebarOpen={isSidebarOpen} totalRecords={studentsAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
          </div>
          <StudentForm
          show={modalShow}
          onHide={hideCreateModal}
        />
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
