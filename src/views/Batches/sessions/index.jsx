import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Collapsible from "../../../components/content/CollapsiblePanels";
import { getSessions } from "../../../store/reducers/sessionAttendances/actions";

const Sessions = (props) => {
  const sessionID = props.match.params.sessionID;
  const { session, loading, attendances, getSessions } = props;

  useEffect(() => {
    getSessions(sessionID);
    // eslint-disable-next-line
  }, []);

  return (
    <Collapsible title="Session" type="plain" opened={true}>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify(attendances, null, 2)}</code>
      </pre>
      <Link
        to={`/update-session/${sessionID}`}
        className="btn btn-primary btn-regular"
      >
        UPDATE
      </Link>
      <button className="btn btn-primary btn-regular" onClick={() => {}}>
        DELETE SESSION
      </button>
    </Collapsible>
  );
};

const mapStateToProps = (state) => ({
  session: state.sessionAttendance.session,
  loading: state.sessionAttendance.loading,
  attendances: state.sessionAttendance.attendances,
});

const mapActionsToProps = {
  getSessions,
};

export default connect(mapStateToProps, mapActionsToProps)(Sessions);
