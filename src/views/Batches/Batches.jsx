import NP from "nprogress";
import moment from "moment";
import api from "../../apis";
import { useCallback, useState, useEffect, useMemo } from "react";
import { GET_BATCHES } from "../../graphql";
import Collapse from "../../components/content/CollapsiblePanels";
import Table from '../../components/content/Table';
import {
  TableRowDetailLink,
  Badge,
} from "../../components/content/Utils";
import { useHistory } from "react-router-dom";
import { createBatch, getBatchesPickList, getStudentCountByBatch } from "./batchActions";
import BatchForm from "./batchComponents/BatchForm";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { connect } from "react-redux";
import TabPicker from "../../components/content/TabPicker";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Batches = (props) => {
  const [batches, setBatches] = useState([]);
  const [batchesAggregate, setBatchesAggregate] = useState([]);
  const [batchesTableData, setBatchesTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory();
  const {setAlert} = props;
  const pageSize = parseInt(localStorage.getItem('tablePageSize')) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const userId  = parseInt(localStorage.getItem('user_id'))
  const state = localStorage.getItem('user_state');
  const area = localStorage.getItem('user_area')

  useEffect(() => {
    switch(activeTab.key) {
      case "my_data":
        getBatches("my_data")
        break;
      case "my_state":
        getBatches("my_state")
        break;
      case "my_area":
        getBatches("my_area")
        break; 
      default:
        getBatches()
        break;
    }
  }, [activeTab]);

  const getBatches = async (selectedTab, limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    NP.start();
    setLoading(true);
    let variables= {
      limit: limit,
      start: offset,
      sort: `${sortBy}:${sortOrder}`,
    }
    if(selectedTab == "my_data"){
      Object.assign(variables, {id: userId})
    } else if(selectedTab == "my_state"){
      Object.assign(variables, {state: state})
    } else if(selectedTab == "my_area"){
      Object.assign(variables, {area: area})
    }
    await api.post("/graphql", {
      query: GET_BATCHES,
      variables,
    })
    .then(batchesData => {
      getStudentCountByBatch().then(data => {
        let batchStudentsCount = {};
        data.data.data.programEnrollmentsConnection.groupBy.batch.map(item => batchStudentsCount[item.key] = item.connection.aggregate.count);
        // adding batch students count to batches data
        let batches = batchesData?.data?.data?.batchesConnection.values.map(batch => {
          return {
            ...batch,
            students_count: batchStudentsCount[batch.id],
          }
        });
        setBatches(batches);
        setBatchesAggregate(batchesData?.data?.data?.batchesConnection?.aggregate);
      });
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
      NP.done();
    });
  };

  useEffect(() => {
    getBatchesPickList().then(data => setPickList(data));
  }, []);

  useEffect(() => {
    let data = batches;
    data = data.map((batch, index) => {
      return {
        id: batch.id,
        name: batch.name,
        students_count: batch.students_count,
        start_date: moment(batch.start_date).format("DD MMM YYYY"),
        status: <Badge value={batch.status} pickList={pickList.status || []} />,
        program: batch.program.name,
        area: batch.assigned_to.area,
        state:batch.assigned_to.state,
        link: <TableRowDetailLink value={batch.id} to={'batch'} />
      }
    });
    setBatchesTableData(data);
  }, [batches, pickList]);

  const columns = useMemo(
    () => [
      {
        Header: 'Batch Name',
        accessor: 'name',
      },
      {
        Header: 'Program',
        accessor: 'program',
      },
      {
        Header: 'Students',
        accessor: 'students_count',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
      },
      {
        Header: 'Area(Assigned To)',
        accessor: 'area',
      },
      {
        Header: 'State(Assigned To)',
        accessor: 'state',
      },
    ],
    []
  );

  const fetchData = useCallback((pageIndex, pageSize, sortBy) => {
    if (sortBy.length) {
      let sortByField = 'created_at';
      let sortOrder = sortBy[0].desc === true ? 'desc' : 'asc';
      switch (sortBy[0].id) {
        case 'name':
        case 'status':
        case 'start_date':
          sortByField = sortBy[0].id;
          break;

        case 'program':
          sortByField = 'program.name'
          break;

        default:
          sortByField = 'created_at';
          break;
      }
      getBatches(pageSize, pageSize * pageIndex, sortByField, sortOrder);
    } else {
      getBatches(pageSize, pageSize * pageIndex);
    }
  }, []);

  const onRowClick = (row) => {
    history.push(`/batch/${row.id}`)
  }

  const hideCreateModal = async (data) => {
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let {show, ...dataToSave} = data;
    dataToSave['start_date'] = moment(data.start_date).format("YYYY-MM-DD");
    dataToSave['end_date'] = moment(data.end_date).format("YYYY-MM-DD");

    NP.start();
    createBatch(dataToSave).then(data => {
      setAlert("Batch created successfully.", "success");
    }).catch(err => {
      console.log("CREATE_DETAILS_ERR", err);
      setAlert("Unable to create batch.", "error");
    }).finally(() => {
      NP.done();
      getBatches();
    });
    setModalShow(false);
  };

  return (
    <Collapse title="Batches" type="plain" opened={true}>
      <div className="row m-3 ">
        <div className="d-flex justify-content-between align-items-center mb-2 px-0">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
            <button
              className="btn btn-primary"
              onClick={() => setModalShow(true)}
            >
              Add New Batch
            </button>
        </div>
      <Table columns={columns} data={batchesTableData} totalRecords={batchesAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} paginationPageSize={paginationPageSize} onPageSizeChange={setPaginationPageSize} />
      <BatchForm
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

export default connect(mapStateToProps, mapActionsToProps)(Batches);
