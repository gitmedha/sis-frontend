import nProgress from "nprogress";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Table from "../../components/content/Table";
import { useHistory } from "react-router-dom";
import TabPicker from "../../components/content/TabPicker";
import api from "../../apis";
import { GET_USER_EMPLOYERS } from "../../graphql";
import Avatar from "../../components/content/Avatar";
import {
  createEmployer,
  getEmployersPickList,
} from "./EmployerComponents/employerAction";
import {
  TableRowDetailLink,
  Badge,
  Anchor,
} from "../../components/content/Utils";
import { setAlert } from "../../store/reducers/Notifications/actions";
import EmployerForm from "./EmployerComponents/EmployerForm";
import { connect } from "react-redux";
import Collapse from "../../components/content/CollapsiblePanels";
import EmployerSearchBar from "./EmployerComponents/EmployerSearchBar";
import { createLatestAcivity } from "src/utils/LatestChange/Api";
import styled from "styled-components";


const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const TSection = styled.div`
 .latto-bold,.text--sm{
    display: flex !important;
    font-family: 'Lato', sans-serif !important;
    font-weight: regular !important;
    font-size:14px !important;
    padding: 0px 0px !important;
    letter-spacing: 0.5px !important;
    justify-content: start !important;
    color: #787B96 !important;
    background-color: #ffffff !important ;

}
.hash-column {
    width: 5rem !important;
  }
  table{
  table-layout: auto;
  }
`;

const Employers = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [employersAggregate, setEmployersAggregate] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [pickList, setPickList] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [employersTableData, setEmployersTableData] = useState([]);
  const pageSize = parseInt(localStorage.getItem("tablePageSize")) || 25;
  const [paginationPageSize, setPaginationPageSize] = useState(pageSize);
  const { setAlert } = props;
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const userId = parseInt(localStorage.getItem("user_id"));
  const state = localStorage.getItem("user_state");
  const area = localStorage.getItem("user_area");
  const [selectedSearchField, setSelectedSearchField] = useState(null);
  const [isSearchEnable, setIsSearchEnable] = useState(false);
  const [selectedSearchedValue, setSelectedSearchedValue] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const prevIsSearchEnableRef = useRef(isSearchEnable);

  useEffect(() => {
    if (isSearchEnable) {
      getEmployers(activeTab.key);
    }
  }, [isSearchEnable, selectedSearchedValue]);

  useEffect(() => {
    const prevIsSearchEnable = prevIsSearchEnableRef.current;
    if (prevIsSearchEnable && !isSearchEnable) {
      getEmployers(activeTab.key);
    }
    prevIsSearchEnableRef.current = isSearchEnable;
  }, [isSearchEnable, activeTab.key]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "avatar",
      },
      {
        Header: "District",
        accessor: "district",
      },
      {
        Header: "State",
        accessor: "state",
      },
      {
        Header: "Industry",
        accessor: "industry",
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.username",
      },
    ],
    []
  );

  const getEmployerBySearchFilter = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    selectedSearchedValue,
    selectedSearchField,
    sortBy,
    sortOrder
  ) => {
    const employerFields = `
    id
    name
    phone
    status
    website
    email
    type
    industry
    paid_leaves
    employee_benefits
    employment_contract
    offer_letter
    medha_partner
    address
    district
    pin_code
    state
    medha_area
    address
    city
    created_at
    updated_at
    logo {
      id
      url
    }
    assigned_to{
      id
      username
      email
    }
    mou_file {
      id
      url
      created_at
    }
    created_by_frontend{
      username
      email
    }
    updated_by_frontend{
      username
      email
    }
    logo {
      url
    }
    contacts {
      id
      email
      phone
      full_name
      designation
    }
  `;

    let variables = {
      limit,
      start: offset,
      sort: `${sortBy ? sortBy : selectedSearchField}:${
        sortOrder ? sortOrder : "asc"
      }`,
    };

    if (selectedTab === "my_data") {
      if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          id: userId,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "state") {
        Object.assign(variables, {
          id: userId,
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          id: userId,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          id: userId,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "industry") {
        Object.assign(variables, {
          id: userId,
          industry_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          id: userId,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedTab === "my_state") {
      if (selectedSearchField === "state") {
        Object.assign(variables, {
          state: selectedSearchedValue.trim(),
        });
      }
      else if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          state: state,
          area: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "status") {
        Object.assign(variables, {
          state: state,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          state: state,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "industry") {
        Object.assign(variables, {
          state: state,
          industry_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          state: state,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedTab === "my_area") {
      if (selectedSearchField === "state") {
        Object.assign(variables, {
          area: area,
          state: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "medha_area") {
        Object.assign(variables, {
          area: selectedSearchedValue.trim(),
        });
      }else if (selectedSearchField === "status") {
        Object.assign(variables, {
          area: area,
          status: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "assigned_to") {
        Object.assign(variables, {
          area: area,
          username: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "industry") {
        Object.assign(variables, {
          area: area,
          industry_name: selectedSearchedValue.trim(),
        });
      } else if (selectedSearchField === "name") {
        Object.assign(variables, {
          area: area,
          name: selectedSearchedValue.trim(),
        });
      }
    } else if (selectedSearchField === "medha_area") {
      Object.assign(variables, { area: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "state") {
      Object.assign(variables, { state: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "status") {
      Object.assign(variables, { status: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "assigned_to") {
      Object.assign(variables, { username: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "industry") {
      Object.assign(variables, { industry_name: selectedSearchedValue.trim() });
    } else if (selectedSearchField === "name") {
      Object.assign(variables, { name: selectedSearchedValue.trim() });
    }

    const employerQuery = `query GET_EMPLOYERS(
  $id: Int,
  $limit: Int,
  $start: Int,
  $sort: String,
  $status: String,
  $state: String,
  $area: String,
  $username: String,
  $industry_name:String,
  $name:String
) {
  employersConnection(
    sort: $sort
    start: $start
    limit: $limit
    where: {
      assigned_to: {
        id: $id
        username: $username
      }
      medha_area: $area
      state: $state
      status: $status
      industry:$industry_name
      name:$name
    }
  ) {
    values {
      ${employerFields}
    }
    aggregate {
      count
    }
  }
}
`;

    await api
      .post("/graphql", {
        query: employerQuery,
        variables,
      })
      .then((data) => {
        setEmployers(data?.data?.data?.employersConnection.values);
        setEmployersAggregate(data?.data?.data?.employersConnection?.aggregate);
        setLoading(false);
        nProgress.done();
      })
      .catch((error) => {
        setLoading(false);
        nProgress.done();
        return Promise.reject(error);
      });
  };

  const getEmployers = async (
    selectedTab,
    limit = paginationPageSize,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc"
  ) => {
    nProgress.start();
    setLoading(true);
    if (isSearchEnable) {
      await getEmployerBySearchFilter(
        selectedTab,
        limit,
        offset,
        selectedSearchedValue,
        selectedSearchField
      );
    } else {
      let variables = {
        limit: limit,
        start: offset,
        sort: `${sortBy}:${sortOrder}`,
      };
      if (selectedTab == "my_data") {
        Object.assign(variables, { id: userId });
      } else if (selectedTab == "my_state") {
        Object.assign(variables, { state: state });
      } else if (selectedTab == "my_area") {
        Object.assign(variables, { area: area });
      }
      await api
        .post("/graphql", {
          query: GET_USER_EMPLOYERS,
          variables,
        })
        .then((data) => {
          setEmployers(data?.data?.data?.employersConnection.values);
          setEmployersAggregate(
            data?.data?.data?.employersConnection?.aggregate
          );
        })
        .catch((error) => {
          return Promise.reject(error);
        })
        .finally(() => {
          setLoading(false);
          nProgress.done();
        });
    }
  };
  useEffect(() => {
    getEmployersPickList().then((data) => setPickList(data));
  }, []);

  useEffect(() => {
    let data = employers;
    data = data.map((employer, index) => {
      return {
        ...employer,
        assignedTo: (
          <Anchor
            text={employer.assigned_to.username}
            href={"/user/" + employer.assigned_to.id}
          />
        ),
        avatar: (
          <Avatar
            name={employer.name}
            logo={employer.logo}
            style={{ width: "35px", height: "35px" }}
            icon="employer"
          />
        ),
        industry: (
          <Badge value={employer.industry} pickList={pickList.industry || []} />
        ),
        link: <TableRowDetailLink value={employer.id} to={"employer"} />,
        href: `/employer/${employer.id}`,
      };
    });
    setEmployersTableData(data);
  }, [employers, pickList]);

  const fetchData = useCallback(
    (
      pageIndex,
      pageSize,
      sortBy,
      isSearchEnable,
      selectedSearchedValue,
      selectedSearchField
    ) => {
      if (sortBy.length) {
        let sortByField = "name";
        let sortOrder = sortBy[0].desc === true ? "desc" : "asc";
        switch (sortBy[0].id) {
          case "employer":
          case "industry":
          case "assigned_to.username":
          case "district":
            sortByField = sortBy[0].id;
            break;

          case "city":
            sortByField = "city";
            break;

          case "state":
            sortByField = "state";
            break;

          case "avatar":
          default:
            sortByField = "name";
            break;
        }
        if (isSearchEnable) {
          getEmployerBySearchFilter(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            selectedSearchedValue,
            selectedSearchField,
            sortByField,
            sortOrder
          );
        } else {
          getEmployers(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            sortByField,
            sortOrder
          );
        }
      } else {
        if (isSearchEnable) {
          getEmployerBySearchFilter(
            activeTab.key,
            pageSize,
            pageSize * pageIndex,
            selectedSearchedValue,
            selectedSearchField
          );
        } else {
          getEmployers(activeTab.key, pageSize, pageSize * pageIndex);
        }
      }
    },
    [activeTab.key]
  );

  const hideCreateModal = async (data) => {
    setFormErrors([]);
    if (!data || data.isTrusted) {
      setModalShow(false);
      return;
    }

    // need to remove `show` from the payload
    let { show, ...dataToSave } = data;

    nProgress.start();
    createEmployer(dataToSave)
      .then(async(data) => {
        if (data.data.errors) {
          setFormErrors(data.data.errors);
        } else {
          setAlert("Employer created successfully.", "success");
          getEmployers();
          setModalShow(false);
          let EmployerEnrollmentData = {
            module_name: "employer",
            activity: "Employer Data Created",
            event_id: data.data.data.createEmployer.employer.id,
            updatedby: userId,
            changes_in: { name: data.data.data.createEmployer.employer.name },
          };
    
          try {
            await createLatestAcivity(EmployerEnrollmentData);
          } catch (error) {
            console.error("Error logging activity:", error);
          }
          history.push(
            `/employer/${data.data.data.createEmployer.employer.id}`
          );
        }
      })
      .catch((err) => {
        setAlert("Unable to create employer.", "error");
        getEmployers();
        setModalShow(false);
      })
      .finally(() => {
        nProgress.done();
      });
  };

  return (
    <Collapse title="EMPLOYERS" type="plain" opened={true}>
      <div className="row">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-2 navbar_sec">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <button
            className="btn btn-primary add_button_sec"
            onClick={() => setModalShow(true)}
            style={{ marginLeft: "15px" }}
          >
            Add New
          </button>
        </div>
        <EmployerSearchBar
          selectedSearchField={selectedSearchField}
          setSelectedSearchField={setSelectedSearchField}
          setIsSearchEnable={setIsSearchEnable}
          setSelectedSearchedValue={setSelectedSearchedValue}
          tab={activeTab.key}
          info={{
            id: userId,
            area: area,
            state: state,
          }}
          isDisable={employersAggregate.count ? false : true}
        />
        <TSection>
        <Table
          columns={columns}
          data={employersTableData}
          paginationPageSize={paginationPageSize}
          totalRecords={employersAggregate.count}
          fetchData={fetchData}
          loading={loading}
          onPageSizeChange={setPaginationPageSize}
          isSearchEnable={isSearchEnable}
          selectedSearchField={selectedSearchField}
          selectedSearchedValue={selectedSearchedValue}
        />
        </TSection>
        <EmployerForm
          show={modalShow}
          onHide={hideCreateModal}
          errors={formErrors}
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
