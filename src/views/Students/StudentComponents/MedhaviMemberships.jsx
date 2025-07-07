import moment from 'moment';
import { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../../../components/content/Table";
import MembershipForm from "./MembershipForm";
import { getStudentMedhaviMemberships, createMembership, updateMembership, deleteMembership } from "./StudentActions";
import { setAlert } from "../../../store/reducers/Notifications/actions";
import SweetAlert from "react-bootstrap-sweetalert";
import { connect } from "react-redux";
import NP from "nprogress";
import MembershipView from "./MembershipView";

const MedhaviMemberships = (props) => {
  let { id, student, onDataUpdate ,membershipsStudent} = props;
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { setAlert } = props;
  const [membershipsAggregate, setMembershipsAggregate] = useState({ count: 0 });
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [membershipsTableData, setMembershipsTableData] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);
const [formMode, setFormMode] = useState('create');

  const fetchStudentMemberships = async (limit = paginationPageSize, offset = 0, sortBy = 'updated_at', sortOrder = 'asc') => {
  NP.start();
  try {
    const {data:{data:{medhaviMembershipsConnection:{values:memberships, aggregate}}} }= await getStudentMedhaviMemberships(id, limit, offset, sortBy, sortOrder);
    setMemberships(memberships || []);
    setMembershipsAggregate(aggregate|| { count: 0 });
  } catch (err) {
    setAlert("Unable to fetch memberships.", "error");
  } finally {
    NP.done();
  }
};
  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'date_of_avail';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'medhavi_member_id':
        case 'membership_status':
        case 'date_of_payment':
        case 'date_of_avail':
        case 'date_of_settlement':
          sortByField = sortBy[0].id;
          break;

        case 'date_of_payment_formatted':
          sortByField = 'date_of_payment';
          break;

        case 'date_of_avail_formatted':
          sortByField = 'date_of_avail';
          break;

        case 'date_of_settlement_formatted':
          sortByField = 'date_of_settlement';
          break;

        case 'tenure_completion_date_formatted':
          sortByField = 'tenure_completion_date';
          break;

        case 'assigned_to':
          sortByField = 'assigned_to.username';
          break;

        default:
          sortByField = 'updated_at';
          break;
      }
      fetchStudentMemberships(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      fetchStudentMemberships(pageSize, pageSize * pageIndex);
    }
  }, []);

  useEffect(() => {
  const formattedData = memberships.map(membership => ({
    ...membership,
    medhavi_member: membership.medhavi_member,
    date_of_payment_formatted: membership.date_of_payment 
      ? moment(membership.date_of_payment).format('DD MMM YYYY') 
      : '',
    date_of_avail_formatted: membership.date_of_avail 
      ? moment(membership.date_of_avail).format('DD MMM YYYY') 
      : '',
    date_of_settlement_formatted: membership.date_of_settlement 
      ? moment(membership.date_of_settlement).format('DD MMM YYYY') 
      : '',
    tenure_completion_date_formatted: membership.tenure_completion_date 
      ? moment(membership.tenure_completion_date).format('DD MMM YYYY') 
      : '',
    updated_at: moment(membership.updated_at).format("DD MMM YYYY"),
  }));
  setMembershipsTableData(formattedData);
}, [memberships]);

  const columns = useMemo(
    () => [
      {
        Header: 'Medhavi Member',
        accessor: 'medhavi_member',
      },
      {
        Header: 'Member ID',
        accessor: 'medhavi_member_id',
      },
      {
        Header: 'Status',
        accessor: 'membership_status',
      },
      {
        Header: 'Date of Payment',
        accessor: 'date_of_payment',
      },
      {
        Header: 'Date of Avail',
        accessor: 'date_of_avail',
      },
      {
        Header: 'Date of Settlement',
        accessor: 'date_of_settlement',
      },
      {
        Header: 'Tenure Completion',
        accessor: 'tenure_completion_date',
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
      },
      {
        Header: 'Assigned To',
        accessor: 'assigned_to.username',
      },
    ],
    []
  );

  const handleRowClick = membership => {
    setSelectedMembership(membership);
    setViewModalShow(true);
  }

  const hideViewModal = () => {
    setViewModalShow(false);
  }

  const handleViewEdit = () => {
  setViewModalShow(false);
  setFormMode('update');
  setShowFormModal(true);
  }

  const handleViewDelete = () => {
    setViewModalShow(false);
    setShowDeleteAlert(true);
  }


  const handleDelete = async () => {
    NP.start();
    deleteMembership(selectedMembership.id)
      .then(data => {
        setAlert("Membership deleted successfully.", "success");
      })
      .catch(err => {
        setAlert("Unable to delete Membership.", "error");
      })
      .finally(() => {
        setShowDeleteAlert(false);
        fetchStudentMemberships();
        onDataUpdate();
        NP.done();
      });
  };

  const hideModal = () => {
    hideViewModal();
    fetchStudentMemberships();
  }

  const handleAddMembership = () => {
  setSelectedMembership({});
  setFormMode('create');
  setShowFormModal(true);
};


const prepareMembershipData = (data, student) => {
  const formatDateForAPI = (date, useCurrentAsDefault = false) => {
    if (date) {
      return moment(date).toISOString();
    }
    return useCurrentAsDefault ? moment().toISOString() : null;
  };


  return {
    ...data,
    date_of_payment: formatDateForAPI(data.date_of_payment, true),
    date_of_avail: formatDateForAPI(data.date_of_avail,true),
    date_of_settlement: formatDateForAPI(data.date_of_settlement,true),
    tenure_completion_date:moment(data.tenure_completion_data).format("YYYY-MM-DD"),
    studentID: student.id,
    membership_fee: Number(data.membership_fee),
    assigned_to: data.assigned_to || localStorage.getItem("user_id")
  };
};
const hideFormModal = async (data) => {
  if (!data || data.isTrusted) {
    setShowFormModal(false);
    return;
  }

 const dataToSave = prepareMembershipData(data, student);
 delete dataToSave.student;

  NP.start();
  try {
    if (formMode === 'create') {
      await createMembership(dataToSave);
      setAlert("Membership created successfully.", "success");
    } else {
      console.log("Selected Membership ID:", selectedMembership.id);
      await updateMembership(selectedMembership.id, dataToSave);
      setAlert("Membership updated successfully.", "success");
    }
    fetchStudentMemberships();
    onDataUpdate();
  } catch (err) {
    setAlert(`Unable to ${formMode} membership.`, "error");
  } finally {
    NP.done();
    setShowFormModal(false);
  }
};

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => handleAddMembership()}
          >
            + Add Membership
          </button>
        </div>
      </div>
      <Table 
        columns={columns} 
        data={membershipsTableData} 
        onRowClick={handleRowClick} 
        totalRecords={membershipsAggregate.count} 
        fetchData={fetchData} 
        showPagination={membershipsAggregate.count > 10} 
        paginationPageSize={paginationPageSize} 
        onPageSizeChange={setPaginationPageSize}
      />
      
      <MembershipView
        show={viewModalShow}
        onHide={hideViewModal}
        handleEdit={handleViewEdit}
        handleDelete={handleViewDelete}
        student={student}
        membership={selectedMembership}
        onUpdate={hideModal}
      />
      
      <MembershipForm
      show={showFormModal}
      onHide={hideFormModal}
      student={student}
      membership={formMode === 'update' ? selectedMembership : null}
      />

      <SweetAlert
        danger
        showCancel
        btnSize="md"
        show={showDeleteAlert}
        onConfirm={() => handleDelete()}
        onCancel={() => setShowDeleteAlert(false)}
        title={
          <span className="text--primary latto-bold">Delete Membership?</span>
        }
        customButtons={
          <>
            <button
              onClick={() => setShowDeleteAlert(false)}
              className="btn btn-secondary mx-2 px-4"
            >
              Cancel
            </button>
            <button onClick={() => handleDelete()} className="btn btn-danger mx-2 px-4">
              Delete
            </button>
          </>
        }
      >
        <p>Member ID: {selectedMembership.medhavi_member_id}</p>
        <p>Status: {selectedMembership.membership_status}</p>
      </SweetAlert>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(MedhaviMemberships);