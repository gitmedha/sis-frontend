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

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
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
      <Collapsible opened={true} title="Students Awaiting Internships/Employment" id="newlyCertifiedStudents" badge={180}>
        <Table variant="primary">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </Collapsible>
    </div>
  );
};

export default Home;
