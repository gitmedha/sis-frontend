import NP from "nprogress";
import api from "../../apis";
import { useState, useEffect } from "react";
import Details from "./batchComponents/Details";
import Sessions from "./batchComponents/Sessions";
import Students from "./batchComponents/Students";
import { TitleWithLogo } from "../../components/content/Avatar";
import Collapsible from "../../components/content/CollapsiblePanels";
import SkeletonLoader from "../../components/content/SkeletonLoader";
import {
  GET_BATCH,
  GET_SESSIONS,
  GET_BATCH_STUDENTS,
  UPDATE_BATCH,
} from "../../graphql";

const Batch = (props) => {
  const [batch, setBatch] = useState({});
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const batchID = Number(props.match.params.id);

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
      await getStudents();
    } catch (err) {
      console.log("ERR", err);
    } finally {
      setLoading(false);
      NP.done();
    }
  };

  const getSessions = async () => {
    try {
      let { data } = await api.post("/graphql", {
        query: GET_SESSIONS,
        variables: {
          id: batchID,
        },
      });
      // console.log("GET_BATCH", data.data);
      setSessions(prepareDummySessionAttendanceAndStatus(data.data.sessions));
    } catch (err) {
      console.log("ERR", err);
    }
  };

  const getStudents = async () => {
    try {
      const batchID = props.match.params.id;
      let { data } = await api.post("/graphql", {
        query: GET_BATCH_STUDENTS,
        variables: {
          id: batchID,
        },
      });
      console.log("GET_STUDENTS", data.data);
      setStudents(data.data.programEnrollments);
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

  const done = () => getThisBatch();

  if (isLoading) {
    return <SkeletonLoader />;
  } else {
    return (
      <div>
        <Collapsible
          titleContent={
            <TitleWithLogo
              done={done}
              id={batch.id}
              logo={batch.logo}
              title={batch.name}
              query={UPDATE_BATCH}
            />
          }
          opened={true}
        >
          <Details batch={batch} />
        </Collapsible>
        <Collapsible title="Sessions" badge={sessions.length}>
          <Sessions sessions={sessions} batchID={props.match.params.id} />
        </Collapsible>
        <Collapsible title="Students" badge={students.length}>
          <Students students={students} />
        </Collapsible>
      </div>
    );
  }
};

export default Batch;
