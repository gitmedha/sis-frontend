import { Link } from "react-router-dom";
import { FaAngleDoubleRight } from "react-icons/fa";

const styleObject = {
  height: "25px",
  display: "flex",
  marginTop: "7px",
  paddingLeft: "5px",
  paddingRight: "5px",
  borderRadius: "5px",
  alignItems: "center",
  letterSpacing: "0.5px",
  justifyContent: "center",
};

const colorRenderer = (value) => {
  switch (value) {
    case "Enrollment Ongoing":
      return {
        color: "#0AC1B6",
        backgroundColor: "#D2FFFC",
      };
    case "To Be Started":
      return {
        color: "#E9AD03",
        backgroundColor: "#FFE69E",
      };
    case "In Progress":
      return {
        color: "#A5BC18",
        backgroundColor: "#E7FE5C",
      };
    case "Completed":
      return {
        color: "#00ADEF",
        backgroundColor: "#D6F4FF",
      };
    case "Discontinued":
      return {
        color: "#F84A00",
        backgroundColor: "#FFD2BF",
      };
  }
};

export const BadgeRenderer = ({ value }) => {
  return (
    <div
      className="text--sm latto-bold"
      style={{
        ...styleObject,
        ...colorRenderer(value),
      }}
    >
      {value}
    </div>
  );
};

export const TableLink = ({ value, to }) => {
  return (
    <Link to={`/${to}/${value}`}>
      <FaAngleDoubleRight size={18} color={"#257b69"} />
    </Link>
  );
};
