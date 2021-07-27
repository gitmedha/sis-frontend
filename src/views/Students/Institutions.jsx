import NP from "nprogress";
import api from "../../apis";
import {
  TableLink,
  BadgeRenderer,
  AvatarRenderer,
  LinkRenderer,
} from "../../components/content/AgGridUtils";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { GET_USER_INSTITUTES } from "../../graphql";
import TabPicker from "../../components/content/TabPicker";
import Table from '../../components/content/Table';
import React from 'react';

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const Institutions = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsAggregate, setInstitutionsAggregate] = useState([]);
  const [institutionsTableData, setInstitutionsTableData] = useState([]);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'avatar',
      },
      {
        Header: 'Assigned To',
        accessor: 'assignedTo',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: '',
        accessor: 'link',
      },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  const getInstitutions = async (limit = 10, offset = 0) => {
    NP.start();
    setLoading(true);
    await api.post("/graphql", {
      query: GET_USER_INSTITUTES,
      variables: {
        // id: user.id,
        limit: limit,
        start: offset,
        id: 2,
        sort: "created_at:desc",
      },
    })
    .then(data => {
      setInstitutions(data?.data?.data?.institutionsConnection.values);
      setInstitutionsAggregate(data?.data?.data?.institutionsConnection?.aggregate);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
      setLoading(false);
      NP.done();
    });
  };

  const fetchData = useCallback(({ pageSize, pageIndex }) => {
    getInstitutions(pageSize, pageSize * pageIndex);
  }, []);

  useEffect(() => {
    let data = institutions;
    data = data.map((institution, index) => {
      institution.assignedTo = <LinkRenderer value={{
        text: institution.assigned_to.username,
        to: '/user/' + institution.assigned_to.id
      }}/>
      institution.avatar = <AvatarRenderer name={institution.name} logo={institution.logo} />
      institution.status = <BadgeRenderer value={institution.status} />
      institution.type = <BadgeRenderer value={institution.type} />
      institution.link = <TableLink value={institution.id} to={'institution'} />
      return institution;
    });
    setInstitutionsTableData(data);
  }, [institutions]);

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
        <button
          className="btn btn-primary"
          onClick={() => history.push("/institution/new")}
        >
          Add New Institution
        </button>
      </div>
      <Table columns={columns} data={institutionsTableData} paginationPageSize={10} totalRecords={institutionsAggregate.count} fetchData={fetchData} loading={loading} />
    </div>
  );
};

export default Institutions;
