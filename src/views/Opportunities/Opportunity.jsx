import NP from "nprogress";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import api from "../../apis";
import Details from "./OpportunityComponents/Details";
import { GET_OPPORTUNITY } from "../../graphql";
import { TitleWithLogo } from "../../components/content/Avatar";
import { setAlert } from "../../store/reducers/Notifications/actions";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";


const Opportunity = (props) => {
    const [isLoading, setLoading] = useState(false);
    const [opportunityData, setOpportunityData] = useState({});
    const {setAlert} = props;
    const { ...rest } = opportunityData;

    const getThisOpportunity = async () => {
        setLoading(true);
        NP.start();
        try {
          const opportunityID = props.match.params.id;
          let { data } = await api.post("/graphql", {
            query: GET_OPPORTUNITY,
            variables: { id: opportunityID },
          });
          setOpportunityData(data.data.opportunity);
        }catch (err) {
            console.log("ERR", err);
        } finally {
          setLoading(false);
          NP.done();
        }
    };
  
    useEffect(() => {
        getThisOpportunity();
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
                        done={() => getThisOpportunity()}
                        id={rest.id}
                        logo={rest.logo}
                        title={rest.name}
                    />
                }
            >
                <Details {...opportunityData}  id={rest.id} />
            </Collapsible>
        </>
        );
    }
};

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
    setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(Opportunity);
