import nProgress from "nprogress";
import { useState, useEffect, useMemo, useCallback } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import TabPicker from "../../components/content/TabPicker";
import api from "../../apis";
import { GET_USER_EMPLOYERS } from "../../graphql";
import Avatar from "../../components/content/Avatar";
import { createEmployer, getEmployersPickList } from "./EmployerComponents/employerAction";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../components/content/Utils";
import { setAlert } from "../../store/reducers/Notifications/actions";
import EmployerForm from "./EmployerComponents/EmployerForm";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Employers = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [employersAggregate, setEmployersAggregate] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [employersTableData, setEmployersTableData] = useState([]);
  const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const {setAlert} = props;
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const userId = parseInt(localStorage.getItem('user_id'))
  const state = localStorage.getItem('user_state');
  const area = localStorage.getItem('user_area')
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    getEmployers(activeTab.key);
  }, [activeTab]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "avatar",
      },
      {
        Header: "District",
        accessor: "district",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Industry",
        accessor: "industry",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.username",
      },
    ],
    []
  );

  const getEmployers = async (selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    let variables ={
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    }
    if(selectedTab === "my_data"){
      Object.assign(variables, {id: userId})
    } else if(selectedTab === "my_state"){
      Object.assign(variables, {state: state})
    } else if(selectedTab === "my_area"){
      Object.assign(variables, {area: area})
    }
    await api.post("/graphql", {
      query: GET_USER_EMPLOYERS,
      variables,
    })
    .then(data => {
      setEmployers(data?.data?.data?.employersConnection.values);
      setEmployersAggregate(data?.data?.data?.employersConnection?.aggregate);
    })
      .catch((error) => {
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
        nProgress.done();
      });
  };
  useEffect(() => {
  getEmployersPickList().then(data => setPickList(data));
}, [])

  useEffect(() => {
    let data = employers;
    data = data.map((employer, index) => {
      return {
        ...employer,
        assignedTo: <Anchor text={employer.assigned_to.username} href={'/user/' + employer.assigned_to.id} />,
        avatar: <Avatar name={employer.name} logo={employer.logo} style={{width: '35px', height: '35px'}} icon="employer" />,
        industry: <Badge value={employer.industry} pickList={pickList.industry || []} />,
        link: <TableRowDetailLink value={employer.id} to={"employer"} />,
        href: `/employer/${employer.id}`,
      }
    });
    setEmployersTableData(data);
  }, [employers, pickList]);

  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'name';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'employer':
        case 'industry':
          sortByField = sortBy[0].id;
          break;

        case 'city':
          sortByField = 'city'
          break;

        case 'state':
          sortByField = 'state'
          break;

        case 'avatar':
        default:
          sortByField = 'name';
          break;
      }
      getEmployers(activeTab.key, pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getEmployers(activeTab.key, pageSize, pageSize * pageIndex);
    }
  }, [activeTab.key]);

  const hideCreateModal = async (data) => {
    setFormErrors([]);
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, ...dataToSave} = data;

    nProgress.start();
    createEmployer(dataToSave).then(data => {
      if (data.data.errors) {
        setFormErrors(data.data.errors);
      } else {
      setAlert("Employer created successfully.", "success");
      getEmployers();
      setModalShow(false);
      history.push(`/employer/${data.data.data.createEmployer.employer.id}`);
      }
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create employer.", "error");
      getEmployers();
      setModalShow(false);
    }).finally(() => {
      nProgress.done();
    });
  };

  return (
    <Collapse title="EMPLOYERS" type="plain" opened={true}>
      <div className="row m-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <button
            className="btn btn-primary"
            onClick={() => setModalShow(true)}
            style={{marginLeft: '15px'}}
          >
            Add New Employer
          </button>
        </div>
        <Table
          columns={columns}
          data={employersTableData}
          paginationPageSize={paginationPageSize}
          totalRecords={employersAggregate.count}
          fetchData={fetchData}
          loading={loading}
          onPageSizeChange={setPaginationPageSize}
        />
        <EmployerForm
          show={modalShow}
          onHide={hideCreateModal}
          errors={formErrors}
        />
      </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employers);
