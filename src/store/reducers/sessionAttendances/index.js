import {
  IS_LOADING,
  GET_SESSION_DETAILS,
  GET_SESSION_ATTENDANCES,
} from "./types";

const initialState = {
  session: null,
  attendances: [],
  loading: false,
};

const sessionAttendanceReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case IS_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    case GET_SESSION_DETAILS:
      return {
        ...state,
        session: payload,
      };
    case GET_SESSION_ATTENDANCES:
      return {
        ...state,
        attendances: payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default sessionAttendanceReducer;
