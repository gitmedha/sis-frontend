import Table from '../../../components/content/Table';
import ProgressBar from "@ramonak/react-progress-bar";
import { useEffect, useMemo, useState } from "react";
import { getBatchesPickList } from "../batchActions";
import { Badge } from "../../../components/content/Utils";
import moment from 'moment';
import { Modal } from "react-bootstrap";
import SkeletonLoader from "../../../components/content/SkeletonLoader";
import { GET_STUDENT_DETAILS } from "../../../graphql";
import api from "../../../apis";
import DetailField from '../../../components/content/DetailField';

const Students = ({ students }) => {
  const [pickList, setPickList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentInModal, setStudentInModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    getBatchesPickList().then(data => {
      setPickList(data);
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Student Name',
        accessor: 'name',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Enrollment status',
        accessor: 'enrollment_status',
      },
      {
        Header: 'Attendance',
        accessor: 'attendance',
      },
    ],
    []
  );

  const showStudentDetails = (student) => {
    console.log('student', student);
    setStudentInModal(student);
    setShowModal(true);
  }

  const studentsTableData = students.map(student => {
    return {
      id: student.id,
      name: `${student.student.first_name} ${student.student.last_name}`,
      phone: student.student.phone,
      enrollment_status: <Badge value={student.status} pickList={pickList.status} />,
      institution: student.institution.name,
      attendance: <ProgressBar completed={student.percent ? student.percent : 0} bgColor={"#5C4CBF"} labelColor={student.percent ? " #fff" : "#1C2833"} baseBgColor={"#EEEFF8"} />,
    };
  });
  console.log('studentsTableData', studentsTableData);

  return (
    <div className="px-3 py-2">
      <div className="row">
        <div className="col-12 mt-3">
          <Table columns={columns} data={studentsTableData} paginationPageSize={studentsTableData.length} totalRecords={studentsTableData.length} fetchData={() => {}} onRowClick={showStudentDetails} />
        </div>
      </div>
      {showModal && (
        <StudentModal
          show={showModal}
          onHide={toggleModal}
          student={studentInModal}
        />
      )}
    </div>
  );
};

const StudentModal = (props) => {
  const [details, setDetails] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getStudentDetails();
  }, []);

  const getStudentDetails = async () => {
    setLoading(true);
    return await api.post("/graphql", {
      query: GET_STUDENT_DETAILS,
      variables: {
        id: props.student.id,
      },
    }).then(data => {
      setDetails(data.data.data.student);
    }).catch(err => {
      Promise.reject(err);
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <Modal
      centered
      size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          <h1 className="text--primary bebas-thick mb-0">{props.student.name}</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="row">
            <div className="col-md-5 col-sm-12">
              <DetailField label="Parents Name" value={details.name_of_parent_or_guardian} />
              <DetailField label="Status" value={details.status} />
              <DetailField label="Category" value={details.category} />
              <DetailField label="Gender" value={details.gender} />
            </div>
            <div className="offset-md-1 col-md-5 col-sm-12">
              <DetailField label="Phone Number" value={details.phone} />
              <DetailField label="Date Of Birth" value={moment(details.date_of_birth).format("DD MMM YYYY")} />
              <DetailField label="Email" value={details.email} />
              <DetailField label="Institution" value={props.student.institution} />
            </div>
          </div>
        )}
        <div className="row mt-3 py-3">
          <div className="d-flex justify-content-end">
            <button
              type="button"
              onClick={props.onHide}
              className="btn btn-secondary btn-regular mr-2"
            >
              CLOSE
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Students;
