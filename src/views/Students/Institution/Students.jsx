import { useCallback, useEffect, useMemo, useState  } from "react";
import Table from "../../../components/content/Table";
import { getProgramEnrollmentsPickList, getInstitutionStudents } from "./instituteActions";
import {
  TableRowDetailLink,
  Badge,
} from "../../../components/content/Utils";
import Avatar from "../../../components/content/Avatar";
import { useHistory } from "react-router-dom";

const Students = ({ id }) => {
  const [programEnrollments, setProgramEnrollments] = useState([]);
  const [institutionStudentsAggregate, setInstitutionStudentsAggregate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [studentsTableData, setStudentsTableData] = useState([]);
  const history = useHistory();
  const paginationPageSize = 10;

  const onRowClick = (row) => {
    history.push(`/student/${row.id}`)
  }

  const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
    setLoading(true);
    let sortByField = 'created_at', sortOrder = 'desc'; // default
    if (sortBy.length) {
      sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'student':
          sortByField = 'student.first_name';
          break;

        case 'status':
        case 'course_type':
          sortByField = sortBy[0].id; // the one that is selected
          break;

        default:
          sortByField = 'created_at';
          break;
      }
    }

    getInstitutionStudents(id, pageSize, pageSize * pageIndex, sortByField, sortOrder).then(data => {
      setProgramEnrollments(data?.data?.data?.programEnrollmentsConnection?.values);
      setInstitutionStudentsAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate.count);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getProgramEnrollmentsPickList().then(data => {
      setPickList(data);
    });
  }, []);

  useEffect(() => {
    let data = programEnrollments;
    data = data.map((programEnrollment, index) => {
      return {
        id: programEnrollment.student.id,
        student: <Avatar logo={programEnrollment.student.logo} name={programEnrollment.student.first_name + ' ' + programEnrollment.student.last_name} icon='student' />,
        area: programEnrollment.student.address.city,
        status: <Badge value={programEnrollment.status} pickList={pickList.status || []} />,
        year_of_course_completion: programEnrollment.year_of_course_completion,
        link: <TableRowDetailLink value={programEnrollment.student.id} to={'student'} />
      }
    });
    setStudentsTableData(data);
  }, [programEnrollments, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Student',
        accessor: 'student',
      },
      {
        Header: 'Area',
        accessor: 'area',
        disableSortBy: true,
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Year of Course Completion',
        accessor: 'year_of_course_completion',
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
      <Table columns={columns} data={studentsTableData} paginationPageSize={paginationPageSize} totalRecords={institutionStudentsAggregate} fetchData={fetchData} loading={loading} onRowClick={onRowClick} />
    </div>
  );
};

export default Students;
