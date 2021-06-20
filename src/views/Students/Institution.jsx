import NP from "nprogress";
import api from "../../apis";
import { useState, useEffect } from "react";
import Details from "./Institution/Details";
import Address from "./Institution/Address";
import Skeleton from "react-loading-skeleton";
import { GET_INSTITUTE } from "../../graphql";
import Contacts from "./Institution/Contacts";
import Collapsible from "../../components/content/CollapsiblePanels";

const Institute = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [instituteData, setInstituteData] = useState({});

  useEffect(() => {
    getThisInstitute();
  }, []);

  const getThisInstitute = async () => {
    setLoading(true);
    NP.start();
    try {
      const instituteID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_INSTITUTE,
        variables: { id: instituteID },
      });

      setInstituteData(data.data.institution);
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const done = () => getThisInstitute();

  const { address, contacts, ...rest } = instituteData;

  console.log("REST", rest);

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <Skeleton count={1} height={30} />
        <div style={{ height: "10px" }} />
        <Skeleton count={1} height={30} />
        <div style={{ height: "10px" }} />
        <Skeleton count={1} height={30} />
        <div style={{ height: "10px" }} />
        <Skeleton count={1} height={30} />
      </div>
    );
  } else {
    return (
      <>
        <Collapsible opened={true} title={rest.name}>
          <Details {...rest} done={done} />
        </Collapsible>
        <Collapsible title="Contacts">
          <Contacts contacts={contacts} id={rest.id} done={done} />
        </Collapsible>
        <Collapsible title="Address">
          <Address {...address} id={rest.id} done={done} />
        </Collapsible>
      </>
    );
  }
};

export default Institute;
