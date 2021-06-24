import NP from "nprogress";
import api from "../../apis";
import { GET_BATCH, GET_SESSIONS } from "../../graphql";
import { useState, useEffect } from "react";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import Students from "./batchComponents/Students";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";

const Batch = (props) => {
  const [batch, setBatch] = useState({});
  const [sessions, setSessions] = useState([]);
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
      await getSessions();
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const getSessions = async () => {
    try {
      const batchID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_SESSIONS,
        variables: {
          // id: Number(batchID)
          id: 1,
        },
      });
      console.log("GET_BATCH", data.data);
      setSessions(prepareDummySessionAttendanceAndStatus(data.data.sessions));
    } catch (err) {
      console.log("ERR", err);
    }
  };

  const prepareDummySessionAttendanceAndStatus = (sessions) => {
    return sessions.map((session) => ({
      ...session,
      attendance: 70,
      status: "In Progress",
    }));
  };

  console.log("SESSIONS", sessions);

  const done = () => getThisBatch();

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <div>
        <Collapsible title="Batch Details" opened={true}>
          <Details batch={batch} />
        </Collapsible>
        <Collapsible title="Sessions">
          <Sessions sessions={sessions} />
        </Collapsible>
        <Collapsible title="Students">
          <Students />
        </Collapsible>
      </div>
    );
  }
};

export default Batch;
