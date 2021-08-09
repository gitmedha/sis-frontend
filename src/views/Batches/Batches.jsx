import NP from "nprogress";
import moment from "moment";
import api from "../../apis";
import { Link } from "react-router-dom";
import { useCallback, useState, useEffect, useMemo } from "react";
import { GET_BATCHES } from "../../graphql";
import Collapse from "../../components/content/CollapsiblePanels";
import Table from '../../components/content/Table';
import {
  TableRowDetailLink,
  Badge,
} from "../../components/content/Utils";
import { useHistory } from "react-router-dom";
import { getBatchesPickList } from "./batchActions";

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [batchesAggregate, setBatchesAggregate] = useState([]);
  const [batchesTableData, setBatchesTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickList, setPickList] = useState([]);
  const history = useHistory();
  const paginationPageSize = 10;

  const getBatches = async (limit = paginationPageSize, offset = 0, sortBy = 'created_at', sortOrder = 'desc') => {
    NP.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_BATCHES,
      variables: {
        limit: limit,
        start: offset,
        // id: user.id,
        id: 2,
        sort: `${sortBy}:${sortOrder}`,
      },
    })
    .then(data => {
      setBatches(data?.data?.data?.batchesConnection.values);
      setBatchesAggregate(data?.data?.data?.batchesConnection?.aggregate);
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
        start_date: moment(batch.start_date).format("DD MMM YYYY"),
        status: <Badge value={batch.status} pickList={pickList.status || []} />,
        program: batch.program.name,
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
        accessor: 'students',
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
        Header: '',
        accessor: 'link',
        disableSortBy: true,
      },
    ],
    []
  );

  const fetchData = useCallback(({ pageSize, pageIndex, sortBy }) => {
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

  return (
    <Collapse title="All Batches" type="plain" opened={true}>
      <div className="row my-4">
        <div className="col-md-6 col-sm-12 ml-auto">
          <Link to="/add-new-batch" className="btn btn-primary btn-regular">
            Add New Batch
          </Link>
        </div>
      </div>
      <Table columns={columns} data={batchesTableData} paginationPageSize={paginationPageSize} totalRecords={batchesAggregate.count} fetchData={fetchData} loading={loading} onRowClick={onRowClick} />
    </Collapse>
  );
};

export default Batches;
