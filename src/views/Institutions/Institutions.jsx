import nProgress from "nprogress";
import api from "../../apis";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
  uploadMoU,
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
  const [formErrors, setFormErrors] = useState([]);
  const {setAlert} = props;
  const [modalShow, setModalShow] = useState(false);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const userId = parseInt(localStorage.getItem('user_id'))
  const state = localStorage.getItem('user_state');
  const area = localStorage.getItem('user_area');

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
        Header: 'Area',
        accessor: 'medha_area',
      },
      {
        Header: 'State',
        accessor: 'state',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
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
      getInstitutions(activeTab.key, pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getInstitutions(activeTab.key, pageSize, pageSize * pageIndex);
    }
  }, [activeTab.key]);

  useEffect(() => {
    getInstitutionsPickList().then(data => setPickList(data));
  }, [])

  useEffect(() => {
    let data = institutions;
    data = data.map((institution, index) => {
      return {
        ...institution,
        avatar: <Avatar name={institution.name} logo={institution.logo} style={{width: '35px', height: '35px'}} />,
        status: <Badge value={institution.status} pickList={pickList.status || []} />,
        type: <Badge value={institution.type} pickList={pickList.type || []} />,
        link: <TableRowDetailLink value={institution.id} to={'institution'} />,
        href: `/institution/${institution.id}`,
      }
    });
    setInstitutionsTableData(data);
  }, [institutions, pickList]);

  const hideCreateModal = async (data) => {
    setFormErrors([]);

    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, mou_file, ...dataToSave} = data;

    if (mou_file) {
      uploadMoU(data.mou_file).then(data => {
        dataToSave['MoU'] = data.data.data.upload.id;
        createInstitutionApi(dataToSave);
      }).catch(err => {
        console.log("MoU_UPLOAD_ERR", err);
        setAlert("Unable to upload MoU.", "error");
      });
    } else {
      createInstitutionApi(dataToSave);
    }
  };

  const createInstitutionApi = dataToSave => {
    nProgress.start();
    createInstitution(dataToSave).then(data => {
      if (data.data.errors) {
        setFormErrors(data.data.errors);
      } else {
        setAlert("Institution created successfully.", "success");
        setModalShow(false);
        getInstitutions();
        history.push(`/institution/${data.data.data.createInstitution.institution.id}`);
      }
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create institution.", "error");
      setModalShow(false);
      getInstitutions();
    }).finally(() => {
      nProgress.done();
    });
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
      <Table columns={columns} data={institutionsTableData} totalRecords={institutionsAggregate.count} fetchData={fetchData} loading={loading} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} />
      <InstitutionForm
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

export default connect(mapStateToProps, mapActionsToProps)(Institutions);
