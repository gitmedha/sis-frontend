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
  const [createModalShow, setCreateModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { setAlert } = props;
  const [membershipsAggregate, setMembershipsAggregate] = useState({ count: 0 });
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const [membershipsTableData, setMembershipsTableData] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState({});

  const fetchStudentMemberships = async (limit = paginationPageSize, offset = 0, sortBy = 'updated_at', sortOrder = 'asc') => {
  NP.start();
  try {
    const data = await getStudentMedhaviMemberships(id, limit, offset, sortBy, sortOrder);
    setMemberships(data.values || []);
    setMembershipsAggregate(data.aggregate || { count: 0 });
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
          sortByField = 'assigned_to.name';
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
    medhavi_member: membership.medhavi_member ? "Yes" : "No",
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
        accessor: 'date_of_payment_formatted',
      },
      {
        Header: 'Date of Avail',
        accessor: 'date_of_avail_formatted',
      },
      {
        Header: 'Date of Settlement',
        accessor: 'date_of_settlement_formatted',
      },
      {
        Header: 'Tenure Completion',
        accessor: 'tenure_completion_date_formatted',
      },
      {
        Header: 'Updated At',
        accessor: 'updated_at',
      },
      {
        Header: '',
        accessor: 'link',
        disableSortBy: true,
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
    setUpdateModalShow(true);
  }

  const handleViewDelete = () => {
    setViewModalShow(false);
    setShowDeleteAlert(true);
  }
  const formatDateForGraphQL = (date) => {
  return date ? moment(date).format('YYYY-MM-DD') : null;
};

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setCreateModalShow(false);
      return;
    }

    // Prepare data for API
    let { id, student: studentName, date_of_payment_formatted, date_of_avail_formatted, 
          date_of_settlement_formatted, tenure_completion_date_formatted, ...dataToSave } = data;

    dataToSave['date_of_payment'] = data.date_of_payment 
  ? moment(data.date_of_payment).toISOString() 
  : null;
dataToSave['date_of_avail'] = data.date_of_avail 
  ? moment(data.date_of_avail).toISOString() 
  : null;
dataToSave['date_of_settlement'] = data.date_of_settlement 
  ? moment(data.date_of_settlement).toISOString() 
  : null;
dataToSave['tenure_completion_date'] = formatDateForGraphQL(data.tenure_completion_date) 
    dataToSave['studentID'] = id;
    dataToSave['membership_fee'] = Number(data.membership_fee);

    NP.start();
    createMembership(dataToSave)
      .then(data => {
        setAlert("Membership created successfully.", "success");
      })
      .catch(err => {
        setAlert("Unable to create Membership.", "error");
      })
      .finally(() => {
        NP.done();
        fetchStudentMemberships();
        onDataUpdate();
      });
    setCreateModalShow(false);
  };

  const hideUpdateModal = async (data) => {
    if (!data || data.isTrusted) {
      setUpdateModalShow(false);
      return;
    }

    // Prepare data for API
    let { id, student: studentName, created_at, updated_at, date_of_payment_formatted, 
          date_of_avail_formatted, date_of_settlement_formatted, tenure_completion_date_formatted, ...dataToSave } = data;
    
    dataToSave['date_of_payment'] = data.date_of_payment ? moment(data.date_of_payment).format("YYYY-MM-DD") : null;
    dataToSave['date_of_avail'] = data.date_of_avail ? moment(data.date_of_avail).format("YYYY-MM-DD") : null;
    dataToSave['date_of_settlement'] = data.date_of_settlement ? moment(data.date_of_settlement).format("YYYY-MM-DD") : null;
    dataToSave['tenure_completion_date'] = data.tenure_completion_date ? moment(data.tenure_completion_date).format("YYYY-MM-DD") : null;
    dataToSave['student'] = student.id;
    dataToSave['membership_fee'] = Number(data.membership_fee);

    NP.start();
    updateMembership(Number(id), dataToSave)
      .then(data => {
        setAlert("Membership updated successfully.", "success");
      })
      .catch(err => {
        setAlert("Unable to update Membership.", "error");
      })
      .finally(() => {
        NP.done();
        fetchStudentMemberships();
        onDataUpdate();
      });
    setUpdateModalShow(false);
  };

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

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-6 col-sm-12 mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setCreateModalShow(true)}
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
        show={createModalShow}
        onHide={hideCreateModal}
        student={student}
      />
      
      {/* <UpdateMembershipForm
        show={updateModalShow}
        onHide={hideUpdateModal}
        student={student}
        membership={selectedMembership}
      /> */}
      
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