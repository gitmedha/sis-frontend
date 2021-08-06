import { useState, useMemo, useCallback } from "react";
import Table from "../../../components/content/Table";
import { getInstitutionStudents } from "./instituteActions";
import {
  TableRowDetailLink,
  Badge,
} from "../../../components/content/Utils";
import Avatar from "../../../components/content/Avatar";
import { useHistory } from "react-router-dom";

const Students = ({ id }) => {
  const [students, setStudents] = useState([]);
  const [institutionStudentsAggregate, setInstitutionStudentsAggregate] = useState([]);
  const [loading, setLoading] = useState(false);
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
      console.log('data', data);
      let programEnrollments = data?.data?.data?.programEnrollmentsConnection?.values;
      // cleanup student data for rendering
      let studentList = programEnrollments.map((programEnrollment) => {
        return {
          id: programEnrollment.student.id,
          student: <Avatar logo={programEnrollment.student.logo} name={programEnrollment.student.first_name + ' ' + programEnrollment.student.last_name} icon='student' />,
          area: programEnrollment.student.address.city,
          status: programEnrollment.status,
          year_of_course_completion: programEnrollment.year_of_course_completion,
          link: <TableRowDetailLink value={programEnrollment.student.id} to={'student'} />
        }
      });
      setStudents(studentList);
      setInstitutionStudentsAggregate(data?.data?.data?.programEnrollmentsConnection?.aggregate.count);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

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
      <Table columns={columns} data={students} paginationPageSize={paginationPageSize} totalRecords={institutionStudentsAggregate} fetchData={fetchData} loading={loading} onRowClick={onRowClick} />
    </div>
  );
};

export default Students;
