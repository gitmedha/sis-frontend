import { useState, useEffect } from "react";
import { Badge } from "../../../components/content/Utils";
import { getInstitutionsPickList } from "./instituteActions";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";

const Details = (props) => {
  const {
    name,
    phone,
    assigned_to,
    website,
    email,
    status,
    type,
    created_at,
    updated_at,
    created_by_frontend,
    updated_by_frontend
  } = props;

  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getInstitutionsPickList().then(data => {
      setPickList(data);
    });
  }, [])

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Name" value={name} />
          <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} />
          <DetailField label="Website" value={<a href={website} target="_blank" rel="noreferrer" className="latto-regular">{website}</a>} />
          <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
          &nbsp;
          <DetailField label="Created By" value={created_by_frontend?.username} />
          <DetailField label="Created At" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <DetailField label="Assigned To" value={assigned_to?.username} />
          <DetailField label="Phone number" value={<a href="tel:+91">{phone}</a>} />
          <div> &nbsp;</div>
          &nbsp;
          <DetailField label="Updated By" value={updated_by_frontend?.username} />
          <DetailField label="Updated At" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
        </div>
      </div>
    </div>
  );
};

export default Details;
