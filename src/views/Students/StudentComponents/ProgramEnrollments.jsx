import styled from "styled-components";
import moment from 'moment';
import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";
import { FaDownload } from "react-icons/fa";

const Styled = styled.div`
  .img-profile-container {
    position: relative;
    .status-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1px 5px 5px 5px;
    }
    .img-profile {
      width: 160px;
      margin-left: auto;
    }
  }
  .separator {
    background-color: #C4C4C4;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  hr {
    height: 1px;
  }
`;

const ProgramEnrollments = ({ programEnrollments }) => {
  programEnrollments = programEnrollments.map((programEnrollment) => {
    return {
      ...programEnrollment,
      registration_date: moment(programEnrollment.registration_date).format("DD MMM YYYY"),
      batch_name: programEnrollment.batch.name,
      institution_name: programEnrollment.institution.name,
      medha_program_certificate: <FaDownload size="20" color="#31B89D" />,
    };
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Batch',
        accessor: 'batch_name',
      },
      {
        Header: 'Institute',
        accessor: 'institution_name',
      },
      // {
      //   Header: 'Program Name',
      //   accessor: 'program_name',
      // },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Registration Date',
        accessor: 'registration_date',
      },
      {
        Header: 'Fees Status',
        accessor: 'fee_status',
      },
      {
        Header: 'Medha Program Certificate',
        accessor: 'medha_program_certificate',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => {}}
          >
            + Add More
          </button>
        </div>
      </div>
      <Table columns={columns} data={programEnrollments} paginationPageSize={programEnrollments.length} totalRecords={programEnrollments.length} fetchData={() => {}} loading={false} showPagination={false} />
    </div>
  );
};

export default ProgramEnrollments;
