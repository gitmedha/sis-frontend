import nProgress from "nprogress";
import api from "../../apis";
import moment from "moment";
import styled from "styled-components";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../components/content/Utils";
import Avatar from "../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import TabPicker from "../../components/content/TabPicker";
import Table from '../../components/content/Table';
import WidgetUtilTab from "../../components/content/WidgetUtilTab";
import { GET_OPPORTUNITIES } from "../../graphql";
import { FaBlackTie, FaBriefcase } from "react-icons/fa";

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

  const Opportunities = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [opportunities, setOpportunities] = useState([]);
    const [pickList, setPickList] = useState([]);
    const [opportunitiesAggregate, setOpportunitiesAggregate] = useState([]);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [opportunitiesTableData, setOpportunitiesTableData] = useState([]);

    const OpportunityIcon = ({opportunity}) => {
      let bgColor = '#FF9700';
      let icon = null;
      switch (opportunity.type) {
        case 'Job':
          bgColor = '#FF9700';
          icon = <FaBriefcase color="#ffffff" size="16" />;
          break;
    
        case 'Internship':
          bgColor = '#12314C';
          icon = <FaBlackTie color="#ffffff" size="16" />;
          break;
      }
      if (icon) {
        return <StyledOpportunityIcon style={{backgroundColor: bgColor}}>
          {icon}
        </StyledOpportunityIcon>;
      }
      return <></>;
    };

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
        accessor: 'opportunity_icon',
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
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
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
        // id: user.id,
        limit: limit,
        start: offset,
        id: 2,
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
       avatar: <Avatar name={`${opportunitydata.role_or_designation}`} logo={opportunitydata.employer.logo} style={{width: '35px', height: '35px'}} icon="student" />,
       role_or_designation: opportunitydata.role_or_designation,
       opportunity_icon: <OpportunityIcon opportunity={opportunitydata} />,
       number_of_opportunities: opportunitydata.number_of_opportunities,
       address: opportunitydata.employer.address, 
       employer: opportunitydata.employer.name,
       created_at: moment(opportunitydata.created_at).format("DD MMM YYYY"),
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities, pickList]);

  const onRowClick = (row) => {
    history.push(`/opportunity/${row.id}`);
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <TabPicker options={tabPickerOptions}/>
        <WidgetUtilTab />
        </div>
        <Table columns={columns} data={opportunitiesTableData} onRowClick={onRowClick} totalRecords={opportunitiesAggregate.count} fetchData={fetchData} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize}/>
      </div>
  );
};

export default Opportunities;