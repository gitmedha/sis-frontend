import nProgress from "nprogress";
import api from "../../apis";
import moment from "moment";
import styled from "styled-components";
import Avatar from "../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import TabPicker from "../../components/content/TabPicker";
import Table from '../../components/content/Table';
import WidgetUtilTab from "../../components/content/WidgetUtilTab";
import { GET_OPPORTUNITIES } from "../../graphql";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import OpportunityForm from "./OpportunityComponents/OpportunityForm";
import { createOpportunity } from "./OpportunityComponents/opportunityAction";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";

const StyledOpportunityIcon = styled.div`
  border-radius: 50%;
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const tabPickerOptions = [
    { title: "My Data", key: "test-1" },
    { title: "My Area", key: "test-2" },
    { title: "My State", key: "test-3" },
    { title: "All Medha", key: "test-4" },
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
        Header: 'Type',
        accessor: 'opportunity_type',
      },
      {
        Header: 'Openings',
        accessor: 'number_of_opportunities',
      },
      {
        Header: 'Area',
        accessor: 'address',
      },
      {
        Header: 'Date Added',
        accessor: 'created_at',
      },
    ],
    []
  );

  const getOpportunities = async (limit = paginationPageSize, offset = 0, sortBy = 'type', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_OPPORTUNITIES,
      variables: {
        id: userId,
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      },
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
          sortByField = sortBy[0].id;
          break;

        case 'created_at':
        case 'address':
        case 'number_of_opportunities':
          sortByField = 'number_of_opportunities'
          break;

        case 'avatar':
        default:
          sortByField = 'role_or_designation';
          break;
      }
      getOpportunities(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getOpportunities(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
    let data = opportunities;
    data = data.map((opportunitydata, index) => {
      return {
      ...opportunitydata,
       avatar: opportunitydata.employer ? <Avatar name={`${opportunitydata.role_or_designation}`} logo={opportunitydata.employer.logo} style={{width: '35px', height: '35px'}} icon="opportunity" /> : <></>,
       role_or_designation: opportunitydata.role_or_designation,
       opportunity_type: opportunitydata.type,
       number_of_opportunities: opportunitydata.number_of_opportunities,
       address: opportunitydata.employer ? opportunitydata.employer.address : '',
       employer: opportunitydata.employer ? opportunitydata.employer.name : '',
       created_at: moment(opportunitydata.created_at).format("DD MMM YYYY"),
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities, pickList]);

  const onRowClick = (row) => {
    history.push(`/opportunity/${row.id}`);
  };

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
            <WidgetUtilTab />
            <button
              className="btn btn-primary"
              onClick={() => setModalShow(true)}
              style={{marginLeft: '15px'}}
            >
              Add New Opportunity
            </button>
          </div>
        </div>
        <Table columns={columns} data={opportunitiesTableData} onRowClick={onRowClick} totalRecords={opportunitiesAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
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
