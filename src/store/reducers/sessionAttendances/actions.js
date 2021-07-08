import {
  IS_LOADING,
  DELETE_SESSION,
  GET_SESSION_DETAILS,
  GET_SESSION_ATTENDANCES,
} from "./types";
import {
  GET_SESSION,
  DELETE_SESSION_Q,
  GET_SESSION_ATTENDANCE,
  DELETE_ATTENDANCE_RECORD,
} from "../../../graphql";

import { queryBuilder } from "../../../apis";
import { setAlert } from "../Notifications/actions";

export const getSessions = (sessionID) => async (dispatch) => {
  dispatch(setLoading());
  try {
    let { data } = await queryBuilder({
      query: GET_SESSION,
      variables: {
        id: Number(sessionID),
      },
    });
    dispatch({
      type: GET_SESSION_DETAILS,
      payload: data.session,
    });
    dispatch(getSessionAttendances(sessionID));
  } catch (err) {
    console.log("GET_SESSION", err);
  } finally {
    dispatch(setLoading());
  }
};

export const getSessionAttendances = (id) => async (dispatch) => {
  try {
    let { data } = await queryBuilder({
      query: GET_SESSION_ATTENDANCE,
      variables: {
        sessionID: Number(id),
      },
    });
    dispatch({
      type: GET_SESSION_ATTENDANCES,
      payload: data.attendances,
    });
  } catch (err) {
    console.log("GET_SESSION_ATTENDANCE", err);
  }
};

export const deleteSession = (id) => async (dispatch, getState) => {
  // console.log("CURRENT_STATE", getState());
  try {
    dispatch(setLoading());
    let { attendances, session } = getState().sessionAttendance;
    // Delete attendance one by one
    await attendances.forEach(async (att) => {
      await queryBuilder({
        query: DELETE_ATTENDANCE_RECORD,
        variables: {
          attendanceID: att.id,
        },
      });
    });
    // Delete Session after deleting attendance records
    await queryBuilder({
      query: DELETE_SESSION_Q,
      variables: {
        sessionID: session.id,
      },
    });
    dispatch({
      type: DELETE_SESSION,
    });
    dispatch(setAlert("Session deleted successfully.", "success"));
  } catch (err) {
    dispatch(setAlert("Unable to delete the session.", "error"));
    console.log("DELETE_ERR", err);
  } finally {
    dispatch(setLoading());
  }
};

export const setLoading = () => ({ type: IS_LOADING });
