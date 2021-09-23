import nProgress from "nprogress";
import api from "../../../apis";
import moment from "moment";
import styled from "styled-components";
import Avatar from "../../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import Table from '../../../components/content/Table';
import { FaBlackTie, FaBriefcase } from "react-icons/fa";

const StyledOpportunityIcon = styled.div`
  border-radius: 50%;
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Opportunities = ({employer, opportunities, onDataUpdate}) => {
  const history = useHistory();
  const [opportunitiesTableData, setOpportunitiesTableData] = useState([]);

  const OpportunityIcon = ({opportunity}) => {
    let bgColor = '#FF9700';
    let icon = null;
    switch (opportunity.type.toLowerCase()) {
      case 'job':
        bgColor = '#FF9700';
        icon = <FaBriefcase color="#ffffff" size="16" />;
        break;

      case 'internship':
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
        Header: 'Area',
        accessor: 'address',
      },
      {
        Header: 'Role/Designation',
        accessor: 'avatar',
      },
      {
        Header: 'Openings',
        accessor: 'number_of_opportunities',
      },
      {
        Header: 'Type',
        accessor: 'opportunity_icon',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Mapped',
        accessor: 'students_mapped',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  useEffect(() => {
    let data = opportunities.map((opportunity, index) => {
      return {
        ...opportunity,
        id: opportunity.id,
        avatar: employer ? <Avatar name={`${opportunity.role_or_designation}`} logo={employer.logo} style={{width: '35px', height: '35px'}} icon="student" /> : <></>,
        role_or_designation: opportunity.role_or_designation,
        opportunity_icon: <OpportunityIcon opportunity={opportunity} />,
        number_of_opportunities: opportunity.number_of_opportunities,
        address: employer ? employer.address : '',
        employer: employer ? employer.name : '',
        created_at: moment(opportunity.created_at).format("DD MMM YYYY"),
      }
    });
    setOpportunitiesTableData(data);
  }, [opportunities]);

  const handleRowClick = (row) => {
    history.push(`/opportunity/${row.id}`);
  };

  return (
    <div className="container py-3">
      <Table columns={columns} data={opportunitiesTableData} paginationPageSize={opportunitiesTableData.length} totalRecords={opportunitiesTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
    </div>
  );
};

export default Opportunities;
