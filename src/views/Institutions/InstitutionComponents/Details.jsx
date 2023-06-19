import { useState, useEffect } from "react";
import { Badge } from "../../../components/content/Utils";
import { getInstitutionsPickList } from "./instituteActions";
import DetailField from "../../../components/content/DetailField";

const Details = (props) => {
  const {
    name,
    phone,
    assigned_to,
    website,
    email,
    status,
    type,
    created_by_frontend,
    updated_by_frontend,
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
          <DetailField label="Type" value={<Badge value={'type'} pickList={pickList.type} />} />
          <DetailField label="Website" value={<a href={website} target="_blank" rel="noreferrer" className="latto-regular">{website}</a>} />
          <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
          <DetailField label="Created By" value={created_by_frontend?.username ?`${created_by_frontend?.username} (${created_by_frontend?.email})`: ''} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Assigned To" value={assigned_to?.username} />
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <DetailField label="Phone number" value={<a href="tel:+91">{phone}</a>} />
          <DetailField label="Updated By" value={updated_by_frontend?.username ?`${updated_by_frontend?.username} (${updated_by_frontend?.email})`: ''} />
        </div>
      </div>
    </div>
  );
};

export default Details;
