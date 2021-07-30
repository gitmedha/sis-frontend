import NP from "nprogress";
import api from "../../apis";
import { useState, useEffect } from "react";
import Details from "./Institution/Details";
import Address from "./Institution/Address";
import { GET_INSTITUTE } from "../../graphql";
import Contacts from "./Institution/Contacts";
import { UPDATE_INSTITUTION } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";

const Institute = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [instituteData, setInstituteData] = useState({});

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
  console.log('instituteData', instituteData);

  useEffect(() => {
    getThisInstitute();
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <>
        <Collapsible
          opened={true}
          titleContent={
            <TitleWithLogo
              done={done}
              id={rest.id}
              logo={rest.logo}
              title={rest.name}
              query={UPDATE_INSTITUTION}
            />
          }
        >
          <Details {...instituteData} done={done} />
        </Collapsible>
        <Collapsible title="Address">
          <Address {...address} id={rest.id} done={done} />
        </Collapsible>
        <Collapsible title="Contacts">
          <Contacts contacts={contacts} id={rest.id} done={done} />
        </Collapsible>
      </>
    );
  }
};

export default Institute;
