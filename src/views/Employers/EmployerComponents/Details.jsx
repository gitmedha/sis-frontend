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
          <DetailField label="Industry" value={<Badge value={industry} pickList={pickList.industry} />} /> 
          <DetailField label="Website" value={ <a href={website} target="_blank" rel="noreferrer" className="latto-regular" > {website} </a> } />
          <DetailField label="Email" value= {<a target="_blank" href={`mailto:${email}`} rel="noreferrer"> {email} </a> } />
          &nbsp;
          <DetailField label="Created By" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
          <DetailField label="Created at" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          {/* <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} /> */}
          <DetailField label="Assigned To" value={assigned_to?.username} />
          <DetailField label="Phone number" value={<a href="tel:+91">{phone} </a>} />
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <div> &nbsp;</div>
          &nbsp;
          <DetailField label="Updated By" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
          <DetailField label="Updated at" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
        </div>
      </div>
    </div>
  );
};

export default Details;
