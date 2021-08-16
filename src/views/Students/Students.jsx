import nProgress from "nprogress";
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

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const Students = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsAggregate, setStudentsAggregate] = useState([]);
  const [studentsTableData, setStudentsTableData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [layout, setLayout] = useState('list');

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
  }, [])

  useEffect(() => {
    let data = students;
    data = data.map((student, index) => {
      console.log('student', student);
      return {
        avatar: <Avatar name={student.first_name} logo={student.logo} style={{width: '35px', height: '35px'}} icon="student" />,
        phone: student.phone,
        status: student.status,
        link: <TableRowDetailLink value={student.id} to={'student'} />,
        // status: <Badge value={student.status} pickList={pickList.status || []} />,
      }
    });
    setStudentsTableData(data);
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
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
        <div>
          <div>{layout}</div>
          <FaThLarge size={30} color={"#257b69"} />
          <Switch checked={layout === 'list'} onChange={() => setLayout(layout === 'list' ? 'grid' : 'list')} />
          <FaListUl size={30} color={"#257b69"} />
        </div>
      </div>
      <Table columns={columns} data={studentsTableData} paginationPageSize={paginationPageSize} totalRecords={studentsAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} />
      {/* <StudentForm
        show={modalShow}
        onHide={hideCreateModal}
      /> */}
    </div>
  );
};

export default Students;
