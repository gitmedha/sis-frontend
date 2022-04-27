import nProgress from "nprogress";
import api from "../../apis";
import moment from "moment";
import styled from "styled-components";
import Avatar from "../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import TabPicker from "../../components/content/TabPicker";
import Table from '../../components/content/Table';
import { GET_OPPORTUNITIES } from "../../graphql";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import OpportunityForm from "./OpportunityComponents/OpportunityForm";
import { createOpportunity, getOpportunitiesPickList } from "./OpportunityComponents/opportunityAction";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";
import { Badge } from "../../components/content/Utils";

const tabPickerOptions = [
    { title: "My Data", key: "my_data" },
    { title: "My Area", key: "my_area" },
    { title: "My State", key: "my_state" },
    { title: "All Medha", key: "all_medha" },
  ];

  const Opportunities = (props) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [opportunities, setOpportunities] = useState([]);
    const [pickList, setPickList] = useState([]);
    const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
    const {setAlert} = props;
    const [opportunitiesAggregate, setOpportunitiesAggregate] = useState([]);
    const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
    const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
    const [opportunitiesTableData, setOpportunitiesTableData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const userId = parseInt(localStorage.getItem('user_id'))
    const state = localStorage.getItem('user_state');
    const area = localStorage.getItem('user_area')

    const OpportunityIcon = ({opportunity, name}) => {
      let icon = null;

      switch (opportunity.type) {
        case 'Job':
          icon = <FaBriefcase size="20" color="#808080"/>;
          break;

        case 'Internship':
          icon = <FaBlackTie size="20" color="#808080"/>;
          break;
      }
      if (icon) {
        return (
        <div className="d-flex align-items-center justify-content-start h-100">
          <div className="flex-row-centered avatar avatar-default " style ={{ width: '35px', height: '35px'}} >
            {icon}
          </div>
          <p className="mb-0 latto-regular" style={{ color: '#787B96'}}>{name}</p>
        </div>)
      }
      return <></>;
    };

  useEffect(() => {
    getOpportunities(activeTab.key);
  }, [activeTab]);

  const columns = useMemo(
    () => [
      {
        Header: 'Role/Designation',
        accessor: 'avatar',
      },
      {
        Header: 'Employer',
        accessor: 'employer',
      },
      {
        Header: 'District',
        accessor: 'district',
      },
      {
        Header: 'Type',
        accessor: 'opportunity_type',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Openings',
        accessor: 'number_of_opportunities',
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
      },
    ],
    []
  );

  useEffect(() => {
    getOpportunitiesPickList().then(data => {
      setPickList(data);
    });
  }, [])

  const getOpportunities = async (selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'type', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    let variables = {
      limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    }
    if(selectedTab == "my_data"){
      Object.assign(variables, {id: userId})
    } else if(selectedTab == "my_area"){
      Object.assign(variables, {area: area})
    }else if(selectedTab == "my_state"){
      Object.assign(variables, {state: state})
    }

    await api.post("/graphql", {
      query: GET_OPPORTUNITIES,
      variables,
    })
    .then(data => {
      setOpportunities(data?.data?.data?.opportunitiesConnection.values);
      setOpportunitiesAggregate(data?.data?.data?.opportunitiesConnection?.aggregate);
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
      let sortByField = 'role';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'employer':
        case 'type':
        case 'district':
        case 'status':
          sortByField = sortBy[0].id;
          break;

        case 'number_of_opportunities':
          sortByField = 'number_of_opportunities';
          break;

        case 'opportunity_type':
          sortByField = 'type';
          break;

        case 'assigned_to.username':
          sortByField = 'assigned_to.username';
          break;

        case 'avatar':
        default:
          sortByField = 'role_or_designation';
          break;
      }
      getOpportunities(activeTab.key, pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getOpportunities(activeTab.key, pageSize, pageSize * pageIndex);
    }
  }, [activeTab.key]);

  useEffect(() => {
    let data = opportunities;
    data = data.map((opportunitydata, index) => {
      return {
      ...opportunitydata,
       role_or_designation: opportunitydata.role_or_designation,
       opportunity_type: <Badge value={opportunitydata.type} pickList={pickList.type} />,
       status: <Badge value={opportunitydata.status} pickList={pickList.status} />,
       number_of_opportunities: opportunitydata.number_of_opportunities,
       address: opportunitydata.employer ? opportunitydata.employer.address : '',
       employer: opportunitydata.employer ? opportunitydata.employer.name : '',
       created_at: moment(opportunitydata.created_at).format("DD MMM YYYY"),
       avatar:  <OpportunityIcon opportunity={opportunitydata} name={opportunitydata.role_or_designation}> {opportunitydata.role_or_designation} </OpportunityIcon>,
       href: `/opportunity/${opportunitydata.id}`,
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities, pickList]);

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, ...dataToSave} = data;

    nProgress.start();
    createOpportunity(dataToSave).then(data => {
      setAlert("Opportunity created successfully.", "success");
      history.push(`/opportunity/${data.data.data.createOpportunity.opportunity.id}`);
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create opportunity.", "error");
    }).finally(() => {
      nProgress.done();
      getOpportunities();
    });
    setModalShow(false);
  };

  return (
    <Collapse title="OPPORTUNITIES" type="plain" opened={true}>
      <div className="row m-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <div className="d-flex justify-content-center align-items-center">
            {/* <WidgetUtilTab /> */}
            <button
              className="btn btn-primary"
              onClick={() => setModalShow(true)}
              style={{marginLeft: '15px'}}
            >
              Add New Opportunity
            </button>
          </div>
        </div>
        <Table columns={columns} data={opportunitiesTableData} totalRecords={opportunitiesAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
        <OpportunityForm
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

export default connect(mapStateToProps, mapActionsToProps)(Opportunities);
