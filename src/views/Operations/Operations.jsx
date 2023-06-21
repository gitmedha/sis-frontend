import nProgress from "nprogress";
import styled from 'styled-components';
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
import { GET_OPERATIONS, GET_STUDENTS } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Tabs from "../../components/content/Tabs";
import Table from '../../components/content/Table';
import { getoperationsPickList, createStudent } from "../Students/StudentComponents/StudentActions";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { FaListUl, FaThLarge } from "react-icons/fa";
import Switch from '@material-ui/core/Switch';
// import StudentGrid from "./StudentComponents/StudentGrid";
import { studentStatusOptions } from "../Students/StudentComponents/StudentConfig";
// import StudentForm from "./StudentComponents/StudentForm";
import Collapse from "../../components/content/CollapsiblePanels";
import { isAdmin, isSRM } from "../../common/commonFunctions";
// import StudentGrid from "../Students/StudentComponents/StudentGrid";
// import StudentForm from "./OperationComponents/OperationDataupdateform";
import OperationCreateform from "./OperationComponents/OperationCreateform";
import OperationDataupdateform from "./OperationComponents/OperationDataupdateform";
import {getAllOperations } from './OperationComponents/operationsActions'

const tabPickerOptions = [
  { title: "User Ops Activities", key: "my_data" },
  { title: "Users Tot", key: "useTot" },
  { title: "Upskilling", key: "Upskilling" },
  { title: "Placements", key: "Placements" },
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

const Operations = (props) => {
  let { isSidebarOpen, batch } = props;
  const [showModal, setShowModal] = useState(false);
  const { setAlert } = props;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState([]);
  const [optsdata, setOptsdata] = useState({});
  const [optsAggregate, setoptsAggregate] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [students, setStudents] = useState([]);
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
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
      },
      {
        Header: 'Activity type',
        accessor: 'activity_type',
      },
      // {
      //   Header: 'Instution',
      //   accessor: 'Institution',
      // },
      {
        Header: 'Area',
        accessor: 'area',
      },
      
      {
        Header: 'Batch',
        accessor: 'batch.name',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
      },
      {
        Header: 'Topic',
        accessor: 'topic',
      },
      // {
      //   Header: 'Donor',
      //   accessor: 'Donor',
      // },
      {
        Header: 'Guest',
        accessor: 'guest',
      },
      // {
      //   Header: 'Designation',
      //   accessor: 'Designation',
      // },
      {
        Header: 'Organization',
        accessor: 'organization',
      },
      
    ],
    []
  );

  const getoperations = async (status = 'All', selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {

    nProgress.start();
    setLoading(true);
    let variables = {
      limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    }
    // if (status !== 'All') {
    //   // variables.status = studentStatusOptions.find(tabStatus => tabStatus.title?.toLowerCase() === status.toLowerCase())?.picklistMatch;
    // }
    // if (selectedTab == "my_data") {
    //   Object.assign(variables, { id: userId })
    // } else if (selectedTab == "my_state") {
    //   Object.assign(variables, { state: state })
    // } else if (selectedTab == "my_area") {
    //   Object.assign(variables, { area: area })
    // }

    await api.post("/graphql", {
      query: GET_OPERATIONS,
      variables,
    })
      .then(data => {
        console.log("data",data.data.data.usersOpsActivitiesConnection.values)
        setOpts(data.data.data.usersOpsActivitiesConnection.values);
        setoptsAggregate(data.data.data.usersOpsActivitiesConnection.aggregate)
        // setStudentsAggregate(data?.data?.data?.studentsConnection?.aggregate);
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
        case 'area':
        case 'start_date':
        case 'end_date':
        case 'batch.name':
          sortByField = sortBy[0].id;
          break;

        default:
          sortByField = 'full_name';
          break;
      }

      getoperations(activeStatus, activeTab.key, pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getoperations(activeStatus, activeTab.key, pageSize, pageSize * pageIndex);
    }
  }, [activeTab.key, activeStatus]);

  useEffect(() => {
    // getoperationsPickList().then(data => setPickList(data));
    console.log("activeTab_Key", activeTab.key);
    console.log("tabPickerOptions", tabPickerOptions);
    fetchData(0, paginationPageSize, []);
  }, []);
  useEffect(() => {

    // getAllOperations().then(data => {setPickList(data)});
    console.log("activeTab_Key", pickList);
    // console.log("tabPickerOptions",tabPickerOptions);

  }, [activeTab]);

  useEffect(() => {
    setPaginationPageIndex(0);
  }, [activeTab.key, activeStatus]);

  useEffect(() => {
    if (opts) {
      let data = opts;
      data = data.map(student => {
        return []
        let studentStatusData = studentStatusOptions.find(status => status.picklistMatch?.toLowerCase() === student?.status?.toLowerCase());
        return {
          ...student,
          // assignedTo: <Anchor text={student.assigned_to?.username} href={'/user/' + student.assigned_to?.id} />,
          avatar: <Avatar name={student.full_name} logo={student.logo} style={{ width: '35px', height: '35px' }} icon="student" />,
          link: <TableRowDetailLink value={student.id} to={'student'} />,
          status: <Badge value={student.status} pickList={pickList.status || []} />,
          category: <Badge value={student.category} pickList={pickList.category || []} />,
          gender: <Badge value={student.gender} pickList={pickList.gender || []} />,
          statusIcon: studentStatusData?.icon,
          registration_date: student.registration_date_latest ? moment(student.registration_date_latest).format("DD MMM YYYY") : null,
          title: student.full_name,
          progressPercent: studentStatusData?.progress,
          href: `/student/${student.id}`,
        }
      });
      setStudentsData([]);
    }
    // console.log("opts",opts);
  }, [opts, pickList]);

  const hideShowModal = async (data) => {
    if (!data || data.isTrusted) {
      setShowModal(false);
      return;
    }

    // need to remove `show` from the payload
    let { show, institution, batch, cv_file, ...dataToSave } = data;
    dataToSave['date_of_birth'] = data.date_of_birth ? moment(data.date_of_birth).format("YYYY-MM-DD") : '';
    if (typeof data.CV === 'object') {
      dataToSave['CV'] = data.CV?.url;
    }

    if (cv_file) {
      uploadFile(data.cv_file).then(data => {
        dataToSave['CV'] = data.data.data.upload.id;
        createStudentApi(dataToSave);
      }).catch(err => {
        console.log("CV_UPLOAD_ERR", err);
        setAlert("Unable to upload CV.", "error");
      });
    } else {
      createStudentApi(dataToSave);
    }
  };
  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let { show, institution, batch, cv_file, ...dataToSave } = data;
    dataToSave['date_of_birth'] = data.date_of_birth ? moment(data.date_of_birth).format("YYYY-MM-DD") : '';
    if (typeof data.CV === 'object') {
      dataToSave['CV'] = data.CV?.url;
    }

    if (cv_file) {
      uploadFile(data.cv_file).then(data => {
        dataToSave['CV'] = data.data.data.upload.id;
        createStudentApi(dataToSave);
      }).catch(err => {
        console.log("CV_UPLOAD_ERR", err);
        setAlert("Unable to upload CV.", "error");
      });
    } else {
      createStudentApi(dataToSave);
    }
  };

  const createStudentApi = dataToSave => {
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
  }


  const handleStudentStatusTabChange = (statusTab) => {
    console.log(statusTab.title);
    setActiveStatus(statusTab.title);
    getoperations(statusTab.title, activeTab.key, paginationPageSize, paginationPageSize * paginationPageIndex);
  }

  const showRowData = (data) => {
    setOptsdata(data)
    setShowModal(true);
  }

  return (
    <Collapse title="OPERATIONS" type="plain" opened={true}>
      <Styled>
        <div className="row m-1">
          {/* <div className="d-flex justify-content-end py-2">
            <FaThLarge size={22} color={layout === 'grid' ? '#00ADEF' : '#787B96'} onClick={() => setLayout('grid')} className="c-pointer" />
            <Switch size="small" checked={layout === 'list'} onChange={() => setLayout(layout === 'list' ? 'grid' : 'list')} color="default" />
            <FaListUl size={22} color={layout === 'list' ? '#00ADEF' : '#787B96'} onClick={() => setLayout('list')} className="c-pointer" />
          </div> */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
            <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
            {/* <Tabs options={studentStatusOptions}  onTabChange={handleStudentStatusTabChange} /> */}
            {(isSRM() || isAdmin()) && <button
              className="btn btn-primary"
              onClick={() => setModalShow(true)}
              style={{ marginLeft: '15px' }}
            >
              Add New Data
            </button>}
          </div>
          <div className={`${layout !== 'list' ? 'd-none' : ''}`}>
            {/* <Table columns={columns} data={studentsData} totalRecords={optsAggregate.count} fetchData={fetchData} loading={loading} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} /> */}

            <Table onRowClick={showRowData} columns={columns} data={opts} totalRecords={optsAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}  paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />

          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center m-2">
          {/* <div className={`col-12 ${layout !== 'grid' ? 'd-none' : ''}`}>
            <StudentGrid data={studentsData} isSidebarOpen={isSidebarOpen} totalRecords={studentsAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} paginationPageIndex={paginationPageIndex} onPageIndexChange={setPaginationPageIndex} />
          </div> */}
          <OperationCreateform
            show={modalShow}
            onHide={hideCreateModal}
          />
          {showModal && (
            <OperationDataupdateform 
              {...optsdata}
              show={showModal}
              onHide={hideShowModal}
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
