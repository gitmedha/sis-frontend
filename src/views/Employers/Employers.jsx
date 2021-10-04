import nProgress from "nprogress";
import { useState, useEffect, useMemo, useCallback } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import TabPicker from "../../components/content/TabPicker";
import api from "../../apis";
import { GET_USER_EMPLOYERS } from "../../graphql";
import Avatar from "../../components/content/Avatar";
import { createEmployer, getEmployersPickList } from "./EmployerComponents/employerAction";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../components/content/Utils";
import { setAlert } from "../../store/reducers/Notifications/actions";
import EmployerForm from "./EmployerComponents/EmployerForm";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const Employers = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [employersAggregate, setEmployersAggregate] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [employersTableData, setEmployersTableData] = useState([]);
  const [paginationPageSize, setPaginationPageSize] = useState(10);
  const {setAlert} = props;

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "avatar",
      },
      {
        Header: "Type of industry",
        accessor: "industry",
      },
      {
        Header: "District",
        accessor: "city",
      },
      {
        Header: "State",
        accessor: "state",
      },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  const getEmployers = async (limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    nProgress.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_USER_EMPLOYERS,
      variables: {
        //id: user.id,
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      },
    })
    .then(data => {
      setEmployers(data?.data?.data?.employersConnection.values);
      setEmployersAggregate(data?.data?.data?.employersConnection?.aggregate);
    })
      .catch((error) => {
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
        nProgress.done();
      });
  };
  useEffect(() => {
  getEmployersPickList().then(data => setPickList(data));
}, [])

  useEffect(() => {
    let data = employers;
    data = data.map((employer, index) => {
      employer.avatar = <Avatar name={employer.name} logo={employer.logo} style={{width: '35px', height: '35px'}} icon="employer" />
      employer.industry = <Badge value={employer.industry} pickList={pickList.industry || []} />;
      employer.link =  <TableRowDetailLink value={employer.id} to={"employer"} />
      return employer;
    });
    setEmployersTableData(data);
  }, [employers, pickList]);

  const onRowClick = (row) => {
    history.push(`/employer/${row.id}`);
  };

  const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
      if (sortBy && sortBy.length) {
        let sortByField = 'name';
        let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
        switch (sortBy[0].id) {
          case 'industry':
            sortByField = sortBy[0].id;
          break;
          case 'address':
          case 'avatar':
          default:
            sortByField = 'name';
          break;
        }
        getEmployers(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getEmployers(pageSize, pageSize * pageIndex);
    }
  }, []);

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, ...dataToSave} = data;

    nProgress.start();
    createEmployer(dataToSave).then(data => {
      setAlert("Employer created successfully.", "success");
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create employer.", "error");
    }).finally(() => {
      nProgress.done();
      getEmployers();
    });
    setModalShow(false);
  };

  return (
    <Collapse title="EMPLOYERS" type="plain" opened={true}>
      <div className="row m-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <button
            className="btn btn-primary"
            onClick={() => setModalShow(true)}
          >
            Add New Employer
          </button>
        </div>
        <Table
          columns={columns}
          data={employersTableData}
          paginationPageSize={paginationPageSize}
          totalRecords={employersAggregate.count}
          fetchData={fetchData}
          loading={loading}
          onRowClick={onRowClick}
        />
        <EmployerForm
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

export default connect(mapStateToProps, mapActionsToProps)(Employers);
