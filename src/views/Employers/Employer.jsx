import NP from "nprogress";
import api from "../../apis";
import { connect } from "react-redux";
import Address from "./EmployerComponents/Address";
import Details from "./EmployerComponents/Details";
import Contacts from "./EmployerComponents/Contacts";
import Location from "./EmployerComponents/Location";
import { useState, useEffect } from "react";
import { TitleWithLogo } from "../../components/content/Avatar";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import Collapsible from "../../components/content/CollapsiblePanels";
import { setAlert } from "../../store/reducers/Notifications/actions";
import { GET_EMPLOYER } from "../../graphql";

const Employer = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [employerData, setEmployerData] = useState({});
  const { address, contacts, location, ...rest } = employerData;

  const getThisEmployer = async () => {
    setLoading(true);
    NP.start();
    try {
      const employerID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_EMPLOYER,
        variables: { id: employerID },
      });
      setEmployerData(data.data.employer);
    } catch (err) {
      console.log("ERR", err);
    }finally {
      setLoading(false);
      NP.done();
    }
  };

  useEffect(() => {
    getThisEmployer();
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
              done={() => getThisEmployer()}
              id={rest.id}
              logo={rest.logo}
              title={rest.name}
            />
          }
        >
          <Details {...employerData} />
        </Collapsible>
        <Collapsible title="Address">
          <Address {...employerData} id={rest.id} />
        </Collapsible>
        <Collapsible title="Location">
          <Location location={location} id={rest.id} />
        </Collapsible>
        <Collapsible title="Contacts">
          <Contacts contacts={contacts} id={rest.id} />
        </Collapsible>
      </>
    );
  }
};
const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Employer);
