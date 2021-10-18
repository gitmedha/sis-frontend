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
import { GET_USER_INSTITUTES } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Table from '../../components/content/Table';
import { getInstitutionsPickList, createInstitution } from "./InstitutionComponents/instituteActions";
import InstitutionForm from "./InstitutionComponents/InstitutionForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import NP from "nprogress";
import Collapse from "../../components/content/CollapsiblePanels";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Institutions = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsAggregate, setInstitutionsAggregate] = useState([]);
  const [institutionsTableData, setInstitutionsTableData] = useState([]);
  const [pickList, setPickList] = useState([]);
  const {setAlert} = props;
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const userId = parseInt(localStorage.getItem('user_id'))
  const state = localStorage.getItem('user_state');
  const area = localStorage.getItem('user_area')

  useEffect(() => {
    getInstitutions(activeTab.key);
  }, [activeTab]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'avatar',
      },
      {
        Header: 'Assigned To',
        accessor: 'assignedTo',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Area',
        accessor: 'medha_area',
      },
      {
        Header: 'State',
        accessor: 'state',
      },
    ],
    []
  );

  const getInstitutions = async (selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    let variables= {
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    }
    
    if(selectedTab == "my_data"){
      Object.assign(variables, {id: userId})
    } else if(selectedTab == "my_state"){
      Object.assign(variables, {state: state})
    } else if(selectedTab == "my_area"){
      Object.assign(variables, {area: area})
    }
    await api.post("/graphql", {
      query: GET_USER_INSTITUTES,
      variables,
    })
    .then(data => {
      setInstitutions(data?.data?.data?.institutionsConnection.values);
      setInstitutionsAggregate(data?.data?.data?.institutionsConnection?.aggregate);
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
      getInstitutions(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getInstitutions(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    getInstitutionsPickList().then(data => setPickList(data));
  }, [])

  useEffect(() => {
    let data = institutions;
    data = data.map((institution, index) => {
      institution.assignedTo = <Anchor text={institution.assigned_to.username} href={'/user/' + institution.assigned_to.id} />
      institution.avatar = <Avatar name={institution.name} logo={institution.logo} style={{width: '35px', height: '35px'}} />
      institution.status = <Badge value={institution.status} pickList={pickList.status || []} />
      institution.type = <Badge value={institution.type} pickList={pickList.type || []} />
      institution.link = <TableRowDetailLink value={institution.id} to={'institution'} />
      return institution;
    });
    setInstitutionsTableData(data);
  }, [institutions, pickList]);

  const onRowClick = (row) => {
    history.push(`/institution/${row.id}`);
  };

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, ...dataToSave} = data;

    nProgress.start();
    createInstitution(dataToSave).then(data => {
      setAlert("Institution created successfully.", "success");
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create institution.", "error");
    }).finally(() => {
      nProgress.done();
      getInstitutions();
    });
    setModalShow(false);
  };

  return (
    <Collapse title="INSTITUTIONS" type="plain" opened={true}>
    <div className="row m-3">
      <div className="d-flex justify-content-between align-items-center mb-2 px-0" >
        <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
        <button
          className="btn btn-primary"
          onClick={() => setModalShow(true)}
          style={{marginLeft: '15px'}}
        >
          Add New Institution
        </button>
      </div>
      <Table columns={columns} data={institutionsTableData} totalRecords={institutionsAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} />
      <InstitutionForm
        show={modalShow}
        onHide={hideCreateModal}
      />
    </div>
    </Collapse>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Institutions);
