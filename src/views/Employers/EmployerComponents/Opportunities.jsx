import nProgress from "nprogress";
import api from "../../../apis";
import moment from "moment";
import styled from "styled-components";
import Avatar from "../../../components/content/Avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import Table from '../../../components/content/Table';
import { FaBlackTie, FaBriefcase } from "react-icons/fa";
import OpportunityForm from "./OpportunityForm";
import { createOpportunity } from "../../Opportunities/OpportunityComponents/opportunityAction";
import { setAlert } from "../../../store/reducers/Notifications/actions";

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
  const [createOpportunityModalShow, setCreateOpportunityModalShow] = useState(false);

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
        accessor: 'opportunity_type',
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
        opportunity_type: opportunity.type,
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

  const hideCreateOpportunityModal = (data) => {
    if (!data || data.isTrusted) {
      setCreateOpportunityModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, employer_name, ...dataToSave} = data;
    dataToSave['employer'] = data.employer.id;

    nProgress.start();
    createOpportunity(dataToSave).then(data => {
      setAlert("Opportunity created successfully.", "success");
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create opportunity.", "error");
    }).finally(() => {
      nProgress.done();
      onDataUpdate();
    });
    setCreateOpportunityModalShow(false);
  }

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateOpportunityModalShow(true)}
          >
            + Add More
          </button>
        </div>
      </div>
      <Table columns={columns} data={opportunitiesTableData} paginationPageSize={opportunitiesTableData.length} totalRecords={opportunitiesTableData.length} fetchData={() => {}} loading={false} showPagination={false} onRowClick={handleRowClick} />
      <OpportunityForm
        show={createOpportunityModalShow}
        onHide={hideCreateOpportunityModal}
        employer={employer}
      />
    </div>
  );
};

export default Opportunities;
