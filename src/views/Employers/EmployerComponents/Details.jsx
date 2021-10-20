import { Badge } from "../../../components/content/Utils";
import DetailField from "../../../components/content/DetailField";
import { useState, useEffect } from "react";
import { getEmployersPickList } from "./employerAction";
import moment from "moment";

const Details = (props) => {
  const { name, phone, assigned_to, website, email, status, type, industry, created_at, updated_at } = props;

  const [pickList, setPickList] = useState([]);

useEffect(() => {
    getEmployersPickList().then(data => {
      setPickList(data);
    });
  }, [])

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Name" value={name} />
          <DetailField label="Email" value= {<a target="_blank" href={`mailto:${email}`} rel="noreferrer"> {email} </a> } />
          <DetailField label="Phone number" value={<a href="tel:+91">{phone} </a>} />
          <DetailField label="Website" value={ <a href={website} target="_blank" rel="noreferrer" className="latto-regular" > {website} </a> } />
          <DetailField label="Created Date" value={moment(created_at).format("DD MMM YYYY")} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          {/* <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} /> */}
          <DetailField label="Assigned To" value={assigned_to?.username} />
          <DetailField label="Industry" value={<Badge value={industry} pickList={pickList.industry} />} /> 
          <DetailField label="Updated Date" value={moment(updated_at).format("DD MMM YYYY")} />
        </div>
      </div>
    </div>
  );
};

export default Details;
