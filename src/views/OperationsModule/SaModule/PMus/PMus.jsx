import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import PMusBulkAdd from "./PMusBulkAdd";
import PMusDataField from "./PMusDataField";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import Table from "../../../../components/content/Table";
import { api } from "../../../../apis";
import { GET_PMUS } from "../../../../graphql/operations";

const columns = [
  { Header: "Year", accessor: "year" },
  { Header: "PMU", accessor: "pmu" },
  { Header: "State", accessor: "State" },
  { Header: "Medha POC", accessor: d => d.medha_poc?.username || "" },
  { Header: "Created At", accessor: "created_at" },
  { Header: "Updated At", accessor: "updated_at" },
];

const PMus = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [showDataField, setShowDataField] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.post("/graphql", {
        query: GET_PMUS,
        variables: {},
      });
      setData(response.data.data.pmusesConnection.values || []);
    } catch (error) {
      setAlert("Failed to fetch PMus data", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => setShowBulkAdd(true);
  const handleBulkAddClose = () => setShowBulkAdd(false);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowDataField(true);
  };
  const handleDataFieldClose = () => setShowDataField(false);

  // Simple search filter (can be replaced with API search)
  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>PMus</h2>
        <Button variant="primary" onClick={handleAddClick}>Add PMus</Button>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        data={filteredData}
        loading={loading}
        onRowClick={handleRowClick}
      />
      {showBulkAdd && (
        <PMusBulkAdd show={showBulkAdd} onHide={handleBulkAddClose} setAlert={setAlert} />
      )}
      {showDataField && selectedRow && (
        <PMusDataField {...selectedRow} show={showDataField} onHide={handleDataFieldClose} setAlert={setAlert} />
      )}
    </div>
  );
};

export default PMus; 