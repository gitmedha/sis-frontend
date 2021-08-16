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
import Table from '../../components/content/Table';
// import { getStudentsPickList, createStudent } from "./StudentComponents/instituteActions";
// import StudentForm from "./StudentComponents/StudentForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from '@material-ui/core/Switch';
import Grid from "../../components/content/Grid";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
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

const Students = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsTableData, setStudentsTableData] = useState([]);
  const [studentsGridData, setStudentsGridData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState('grid');

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

  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  const paginationPageSize = 2;

  const getStudents = async (limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_STUDENTS,
      variables: {
        // id: user.id,
        limit: limit,
        start: offset,
        id: 2,
        sort: `${sortBy}:${sortOrder}`,
      },
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

  const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
    console.log("pageSize, pageIndex, sortBy");
    console.log(pageSize, pageIndex, sortBy);
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
      getStudents(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getStudents(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    // getStudentsPickList().then(data => setPickList(data));
    fetchData({
      pageSize: 10,
      pageIndex: 0,
      sortBy: [],
      // sortBy: [{id: 'created_at', 'desc': true}],
    });
  }, [])

  useEffect(() => {
    let data = students;
    data = data.map((student, index) => {
      console.log('student table', student);
      return {
        avatar: <Avatar name={student.first_name} logo={student.logo} style={{width: '35px', height: '35px'}} icon="student" />,
        phone: student.phone,
        status: student.status,
        link: <TableRowDetailLink value={student.id} to={'student'} />,
        // status: <Badge value={student.status} pickList={pickList.status || []} />,
      }
    });
    setStudentsTableData(data);

    let gridData = students.map(student => {
      console.log('student grid', student);
      return {
        title: `${student.first_name} ${student.last_name}`,
        logo: student.logo,
        icon: "student",
      }
    });
    setStudentsGridData(gridData);
  }, [students, pickList]);

  const onRowClick = (row) => {
    history.push(`/student/${row.id}`)
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
        <div className="d-flex justify-content-between align-items-center mb-2">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <div>
            <FaThLarge size={22} color={layout === 'grid' ? '#00ADEF' : '#787B96'} />
            <Switch size="small" checked={layout === 'list'} onChange={() => setLayout(layout === 'list' ? 'grid' : 'list')} color="default" />
            <FaListUl size={22} color={layout === 'list' ? '#00ADEF' : '#787B96'} />
          </div>
        </div>
        {layout === 'list' ? (
          <Table columns={columns} data={studentsTableData} paginationPageSize={paginationPageSize} totalRecords={studentsAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} />
        ) : (
          <Grid data={studentsGridData} />
        )}
        {/* <StudentForm
          show={modalShow}
          onHide={hideCreateModal}
        /> */}
      </div>
    </Styled>
  );
};

export default Students;
