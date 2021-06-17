import { urlPath } from "../../constants";
import { FaSchool } from "react-icons/fa";
const Avatar = ({ logo, name }) => {
  return (
    <div className="d-flex align-items-center justify-content-start">
      {logo ? (
        <img
          className={"avatar img-fluid"}
          src={urlPath(logo.url)}
          alt={`${name}-logo`}
        />
      ) : (
        <div className="d-flex justify-content-center align-items-center avatar avatar-default">
          <FaSchool size={25} />
        </div>
      )}
      <p className="mt-3">{name}</p>
    </div>
  );
};

export default Avatar;
