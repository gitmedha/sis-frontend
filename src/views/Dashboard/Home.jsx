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
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Medha", key: "test-4" },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  useEffect(() => {
    // console.log(activeTab.key);
  }, [activeTab]);

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
              value={23000}
              title="Registrations"
              icon={<FaClipboardCheck size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="danger"
              value={23000}
              title="Certifications"
              caption="65% of Registrations"
              icon={<FaGraduationCap size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="warning"
              value={23000}
              title="Internships"
              caption="29% of Certifications"
              icon={<FaBlackTie size={25} color={"white"} />}
            />
          </div>
          <div className="col-md-3 col-sm-12">
            <InfoCards
              type="info"
              value={23000}
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
