import { SET_SIDEBAR_TOGGLE_MOBILE } from "./types";

const INIT_STATE = {
  sidebarToggleMobile: false,
};

const Theme = (state = INIT_STATE, { type, sidebarToggleMobile }) => {
  switch (type) {
    case SET_SIDEBAR_TOGGLE_MOBILE:
      return {
        ...state,
        sidebarToggleMobile,
      };
    default:
      return state;
  }
};

export default Theme;
