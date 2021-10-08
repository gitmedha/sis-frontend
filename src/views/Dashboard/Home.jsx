import api from "../../../src/apis";
import { GET_STATE_METRICS, GET_DISTRICT_METRICS } from "../../graphql";

import {
  FaBlackTie,
  FaBriefcase,
  FaGraduationCap,
  FaClipboardCheck,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import InfoCards from "./components/InfoCards";
import { Table } from "react-bootstrap";
import BarCharts from "../../components/content/Chart";
import TabPicker from "../../components/content/TabPicker";
import WidgetUtilTab from "../../components/content/WidgetUtilTab";
import Collapsible from "../../components/content/CollapsiblePanels";
import Opportunities from "./components/Opportunities";
import Students from "./components/Students";

const tabPickerOptions = [
  { title: "My Data", key: "my_data" },
  { title: "My Area", key: "my_area" },
  { title: "My State", key: "my_state" },
  { title: "All Medha", key: "all_medha" },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);
  const state = (localStorage.getItem('user_state'));
  const district = (localStorage.getItem('user_district'));
  const [userState, setUserState] = useState({});

  
  useEffect(() => {
    if(activeTab.key == "my_state"){
      myStateMetrics()
    } 
    else if (activeTab.key == "my_area") {
        myDistrictMetrics()
    }
  }, [activeTab]);

  const myStateMetrics = async () => {
    await api.post("/graphql", {
      query: GET_STATE_METRICS,
      variables: {
         state
      },
    })
    .then(data => {
      console.log(data.data.data.metricsStates)
      setUserState(data.data.data.metricsStates[0]);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
    });
  };


  const myDistrictMetrics = async () => {
    await api.post("/graphql", {
      query: GET_DISTRICT_METRICS,
      variables: {
         district
      },
    })
    .then(data => {
      console.log(data.data.data.metricsDistricts)
      setUserState(data.data.data.metricsDistricts[0]);
    })
    .catch(error => {
      return Promise.reject(error);
    })
    .finally(() => {
    });
  };
 
  return (
    <div className="container-fluid">
      <Collapsible opened={true} title="Key Metrics" id="keyMetrics">
        <div className="d-flex justify-content-between">
          <TabPicker options={tabPickerOptions} setActiveTab={setActiveTab} />
          <WidgetUtilTab />
        </div>
        <div className="row py-2">
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="success"
              value={userState.registrations? userState.registrations :"2300" } 
              title="Registrations"
              icon={<FaClipboardCheck size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="danger"
              value={userState.certifications? userState.certifications :"2300" } 
              title="Certifications"
              caption="65% of Registrations"
              icon={<FaGraduationCap size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="warning"
              value={userState.internships? userState.internships :"2300" } 
              title="Internships"
              caption="29% of Certifications"
              icon={<FaBlackTie size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="info"
              value={userState.placements? userState.placements :"2300" } 
              title="Placements"
              caption="11% of Certifications"
              icon={<FaBriefcase size={25} color={"white"} />}
            />
          </div>
        </div>
      </Collapsible>
      <Collapsible opened={true} title="Charts">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">
                <BarCharts />
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="card">
              <div className="card-body">Hello World</div>
            </div>
          </div>
        </div>
      </Collapsible>
      <Opportunities />
      <Students />
    </div>
  );
};

export default Home;
