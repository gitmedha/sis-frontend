import NP from "nprogress";
import api from "../../apis";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { GET_MY_INSTITUTES } from "../../graphql";
import Table from "../../components/content/Table";
import Badge from "../../components/content/Badge";
import Avatar from "../../components/content/Avatar";
import TabPicker from "../../components/content/TabPicker";
import { FaAngleDoubleRight, FaLongArrowAltDown } from "react-icons/fa";

const tabPickerOptions = [
  { title: "My Data", key: "test-1" },
  { title: "My Area", key: "test-2" },
  { title: "My State", key: "test-3" },
  { title: "All Area", key: "test-4" },
];

const Institutions = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [activeTab, setActiveTab] = useState(tabPickerOptions[0]);

  useEffect(() => {}, [activeTab]);

  const getAllInstitutes = async () => {
    setLoading(true);
    NP.start();
    try {
      let { data } = await api.post("/graphql", {
        query: GET_MY_INSTITUTES,
        variables: {
          limit: 10,
          // id: user.id,
          id: 2,
          sort: "created_at:desc",
        },
      });
      console.log("DATA", data);
      setInstitutions(data.data.institutions);
    } catch (err) {
      console.log("INSTITUTIONS", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const viewInstitute = ({ id }) => history.push(`/institution/${id}`);

  useEffect(() => {
    getAllInstitutes();
  }, []);

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
      {!isLoading ? (
        <Table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">
                Name
                <FaLongArrowAltDown size={16} style={{ marginLeft: "10px" }} />
              </th>
              <th scope="col">
                Assigned To{" "}
                <FaLongArrowAltDown size={16} style={{ marginLeft: "10px" }} />
              </th>
              <th scope="col">
                Status{" "}
                <FaLongArrowAltDown size={16} style={{ marginLeft: "10px" }} />
              </th>
              <th scope="col">
                Type{" "}
                <FaLongArrowAltDown size={16} style={{ marginLeft: "10px" }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institute, index) => (
              <tr key={institute.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <Avatar {...institute} />
                </td>
                <td>@mdo</td>
                <td>
                  <Badge type={institute.status} text={institute.status} />
                </td>
                <td>
                  <Badge type={"pvt"} text={"ITI"} />
                </td>
                <td>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => viewInstitute(institute)}
                  >
                    <FaAngleDoubleRight size={18} color={"#257b69"} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Skeleton count={3} height={50} />
      )}
    </div>
  );
};

export default Institutions;
