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
import { GET_STUDENTS } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from '../../components/content/Table';
import { getStudentsPickList } from "./StudentComponents/StudentActions";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from '@material-ui/core/Switch';
import StudentGrid from "./StudentComponents/StudentGrid";
import {studentStatusOptions} from "./StudentComponents/StudentConfig";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Medha", key: "test-4" },
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

const Students = ({ isSidebarOpen, batch }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState('grid');
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
        Header: 'Latest Course Type',
        accessor: 'course_type_latest',
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
      variables.status = studentStatusOptions.find(tabStatus => tabStatus.title.toLowerCase() === status.toLowerCase()).picklistMatch;
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
      let sortByField = 'first_name';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'status':
        case 'phone':
        case 'course_type_latest':
          sortByField = sortBy[0].id;
          break;

        case 'avatar':
        default:
          sortByField = 'first_name';
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
    if (students) {
      let data = students;
      data = data.map(student => {
        let studentStatusData = studentStatusOptions.find(status => status.picklistMatch.toLowerCase() === student?.status.toLowerCase());
        return {
          ...student,
          avatar: <Avatar name={`${student.first_name} ${student.last_name}`} logo={student.logo} style={{width: '35px', height: '35px'}} icon="student" />,
          link: <TableRowDetailLink value={student.id} to={'student'} />,
          gridLink: `/student/${student.id}`,
          status: <Badge value={student.status} pickList={pickList.status || []} />,
          category: <Badge value={student.category} pickList={pickList.category || []} />,
          gender: <Badge value={student.gender} pickList={pickList.gender || []} />,
          statusIcon: studentStatusData?.icon,
          title: `${student.first_name} ${student.last_name}`,
          progressPercent: studentStatusData?.progress,
        }
      });
      setStudentsData(data);
    }
  }, [students, pickList]);

  const onRowClick = (row) => {
    history.push(`/student/${row.id}`)
  }

  const handleStudentStatusTabChange = (activeTab) => {
    setActiveStatus(activeTab.title);
    getStudents(activeTab.title, paginationPageSize, paginationPageSize * paginationPageIndex);
  }

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
          <Tabs options={studentStatusOptions} onTabChange={handleStudentStatusTabChange} />
        </div>
        <div className={`${layout !== 'list' ? 'd-none' : ''}`}>
          <Table columns={columns} data={studentsData} totalRecords={studentsAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
        </div>
        <div className={`${layout !== 'grid' ? 'd-none' : ''}`}>
          <StudentGrid data={studentsData} isSidebarOpen={isSidebarOpen} totalRecords={studentsAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
        </div>
      </div>
    </Styled>
  );
};

export default Students;
