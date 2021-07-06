import {
  IS_LOADING,
  GET_SESSION_DETAILS,
  GET_SESSION_ATTENDANCES,
} from "./types";
import { queryBuilder } from "../../../apis";
import { GET_SESSION, GET_SESSION_ATTENDANCE } from "../../../graphql";

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

export const setLoading = () => ({ type: IS_LOADING });
