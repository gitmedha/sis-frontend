import NP from "nprogress";
import api from "../../apis";
import { GET_BATCH } from "../../graphql";
import { useState, useEffect } from "react";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import Students from "./batchComponents/Students";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";

const Batch = (props) => {
  const [batch, setBatch] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getThisBatch();
  }, []);

  const getThisBatch = async () => {
    setLoading(true);
    NP.start();
    try {
      const batchID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_BATCH,
        variables: { id: Number(batchID) },
      });
      console.log("GET_BATCH", data.data);
      setBatch(data.data.batch);
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const done = () => getThisBatch();

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <div>
        <Collapsible title="Batch Details" opened={true}>
          <Details />
        </Collapsible>
        <Collapsible title="Sessions">
          <Sessions />
        </Collapsible>
        <Collapsible title="Students">
          <Students />
        </Collapsible>
      </div>
    );
  }
};

export default Batch;
