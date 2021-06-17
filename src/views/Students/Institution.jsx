import NP from "nprogress";
import api from "../../apis";
import { useState, useEffect } from "react";
import { GET_INSTITUTE } from "../../graphql";
import Collapsible from "../../components/content/CollapsiblePanels";
import Details from "./Institution/Details";
import Contacts from "./Institution/Contacts";
import Address from "./Institution/Address";

const Institute = (props) => {
  const [loading, setLoading] = useState(true);
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

  const { address, contacts, ...rest } = instituteData;

  console.log("REST", rest);

  return (
    <>
      <Collapsible opened={true} title="Details">
        <Details {...rest} />
      </Collapsible>
      <Collapsible title="Contacts">
        <Contacts contacts={contacts} id={rest.id} />
      </Collapsible>
      <Collapsible title="Address">
        <Address {...address} id={rest.id} />
      </Collapsible>
    </>
  );
};

export default Institute;
