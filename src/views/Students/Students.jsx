import nProgress from "nprogress";
import styled from 'styled-components';
import api from "../../apis";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../components/content/Utils";
import Avatar from "../../components/content/Avatar";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { GET_STUDENTS, GET_USER_INSTITUTES } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from '../../components/content/Table';
import { getStudentsPickList } from "./StudentComponents/StudentActions";
// import StudentForm from "./StudentComponents/StudentForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaClipboardCheck, FaBlackTie, FaListUl, FaThLarge, FaBriefcase, FaGraduationCap } from "react-icons/fa";
import Switch from '@material-ui/core/Switch';
import StudentGrid from "./StudentComponents/StudentGrid";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const studentStatusTabOptions = [
  {
    title: 'All',
  },
  {
    icon: <FaClipboardCheck size={20} color="#31B89D" />,
    title: 'Registered',
  },
  {
    icon: <FaGraduationCap size={20} color="#31B89D" />,
    title: 'Certified',
  },
  {
    icon: <FaBlackTie size={20} color="#31B89D" />,
    title: 'Interned',
  },
  {
    icon: <FaBriefcase size={20} color="#31B89D" />,
    title: 'Placed',
  },
]

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

const Students = ({ isSidebarOpen }) => {
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
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [paginationPageIndex, setPaginationPageIndex] = useState(0);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'avatar',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Latest Enrollment Status',
        accessor: 'latest_enrollment_status',
      },
      {
        Header: 'Latest Course Type',
        accessor: 'latest_course_type',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const getStudents = async (status = 'All', limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    let variables = {
      limit,
      start: offset,
      // id: user.id,
      id: 2,
      sort: `${sortBy}:${sortOrder}`,
    }
    if (status !== 'All') {
      variables.status = status;
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
      let sortByField = 'name';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'status':
        case 'type':
          sortByField = sortBy[0].id;
          break;

        case 'assignedTo':
          sortByField = 'assigned_to.username'
          break;

        case 'avatar':
        default:
          sortByField = 'name';
          break;
      }
      getStudents(activeStatus, pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getStudents(activeStatus, pageSize, pageSize * pageIndex);
    }
  }, [activeStatus]);

  useEffect(() => {
    getStudentsPickList().then(data => setPickList(data));
    fetchData(0, paginationPageSize, []);
  }, []);

  useEffect(() => {
    let data = students;
    data = data.map(student => {
      return {
        ...student,
        avatar: <Avatar name={student.first_name} logo={student.logo} style={{width: '35px', height: '35px'}} icon="student" />,
        link: <TableRowDetailLink value={student.id} to={'student'} />,
        gridLink: `/student/${student.id}`,
        status: <Badge value={student.status} pickList={pickList.status || []} />,
        category: <Badge value={student.category} pickList={pickList.category || []} />,
        gender: <Badge value={student.gender} pickList={pickList.gender || []} />,
        statusIcon: studentStatusTabOptions.find(status => status.title.toLowerCase() === student?.status.toLowerCase())?.icon,
        title: `${student.first_name} ${student.last_name}`,
      }
    });
    setStudentsData(data);
  }, [students, pickList]);

  const onRowClick = (row) => {
    history.push(`/student/${row.id}`)
  }

  const handleStudentStatusTabChange = (activeTab) => {
    setActiveStatus(activeTab.title);
    getStudents(activeTab.title, paginationPageSize, paginationPageSize * paginationPageIndex);
  }

  // const hideCreateModal = async (data) => {
  //   if (!data || data.isTrusted) {
  //     setModalShow(false);
  //     return;
  //   }

  //   // need to remove `show` from the payload
  //   let {show, ...dataToSave} = data;

  //   nProgress.start();
  //   createStudent(dataToSave).then(data => {
  //     setAlert("Student created successfully.", "success");
  //   }).catch(err => {
  //     console.log("CREATE_DETAILS_ERR", err);
  //     setAlert("Unable to create student.", "error");
  //   }).finally(() => {
  //     nProgress.done();
  //     getStudents();
  //   });
  //   setModalShow(false);
  // };

  return (
    <Styled>
      <div className="container py-3">
        <div className="d-flex justify-content-end py-2">
          <FaThLarge size={22} color={layout === 'grid' ? '#00ADEF' : '#787B96'} onClick={() => setLayout('grid')} className="c-pointer" />
          <Switch size="small" checked={layout === 'list'} onChange={() => setLayout(layout === 'list' ? 'grid' : 'list')} color="default" />
          <FaListUl size={22} color={layout === 'list' ? '#00ADEF' : '#787B96'} onClick={() => setLayout('list')} className="c-pointer" />
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <Tabs options={studentStatusTabOptions} onTabChange={handleStudentStatusTabChange} />
        </div>
        <div className={`${layout !== 'list' ? 'd-none' : ''}`}>
          <Table columns={columns} data={studentsData} totalRecords={studentsAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
        </div>
        <div className={`${layout !== 'grid' ? 'd-none' : ''}`}>
          <StudentGrid data={studentsData} isSidebarOpen={isSidebarOpen} totalRecords={studentsAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
        </div>
        {/* <StudentForm
          show={modalShow}
          onHide={hideCreateModal}
        /> */}
      </div>
    </Styled>
  );
};

export default Students;
