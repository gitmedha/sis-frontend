import { useState, useEffect } from "react";
import { Badge } from "../../../components/content/Utils";
import { getInstitutionsPickList } from "./instituteActions";
import DetailField from "../../../components/content/DetailField";
import moment from "moment";
import { Tooltip } from "react-bootstrap";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import FileUpload from "../../../components/content/FileUpload";
import api from "../../../apis";
import { UPDATE_INSTITUTION } from "../../../graphql";
import { urlPath } from "../../../constants";

const Details = (props) => {
  let { onUpdate, onDelete } = props;
  const {
    id,
    name,
    phone,
    assigned_to,
    website,
    email,
    status,
    type,
    MOU,
    created_at,
    updated_at,
    created_by_frontend,
    updated_by_frontend,
  } = props;

  const [pickList, setPickList] = useState([]);

  useEffect(() => {
    getInstitutionsPickList().then(data => {
      setPickList(data);
    });
  }, [])

  const mapMouFile = async (fileId) => {
    await api.post("/graphql", {
      query: UPDATE_INSTITUTION,
      variables: {
        data: { MoU: fileId },
        id,
      },
    });
  }

  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-6 col-md-4">
          <DetailField label="Name" value={name} />
          <DetailField label="Type" value={<Badge value={type} pickList={pickList.type} />} />
          <DetailField label="Website" value={<a href={website} target="_blank" rel="noreferrer" className="latto-regular">{website}</a>} />
          <DetailField label="Email" value={<a target="_blank" href={`mailto:${email}`} rel="noreferrer">{email}</a>} />
          &nbsp;
          <DetailField label="Created By" value={created_by_frontend?.username ?`${created_by_frontend?.username} (${created_by_frontend?.email})`: ''} />
          <DetailField label="Created At" value={moment(created_at).format("DD MMM YYYY, h:mm a")} />
        </div>
        <div className="col-6 offset-md-2 col-md-4">
          <DetailField label="Assigned To" value={assigned_to?.username} />
          <DetailField label="Status" value={<Badge value={status} pickList={pickList.status} />} />
          <DetailField label="Phone number" value={<a href="tel:+91">{phone}</a>} />
          <div> &nbsp;</div>
          <DetailField label="Updated By" value={updated_by_frontend?.username ?`${updated_by_frontend?.username} (${updated_by_frontend?.email})`: ''} />
          <DetailField label="Updated At" value={moment(updated_at).format("DD MMM YYYY, h:mm a")} />
          &nbsp;
          <DetailField label="MOU Upload" value=
              {MOU &&
                <div>
                  <label>MOU</label>
                  <p className="mb-0">(updated on: {moment(MOU.updated_at).format("DD MMM YYYY, h:mm a")})</p>
                </div>
                }
            />
              <div className="row">
              <div className="col-md-6"></div>
              <div className="col-md-6 d-flex">
                <div className="mou-icon">
                  <FileUpload mapFileToEntity={mapMouFile} done={() => onUpdate()} />
                </div>
                {MOU &&
                  <div className="mou-icon">
                    <div className="d-flex flex-column section-mou">
                      <Tooltip placement="top" title="Click Here to View MOU">
                        <a href={urlPath(MOU?.url)} target="_blank" rel="noreferrer" ><FaEye size="27" color={MOU ? '#207B69' : '#787B96'}/></a>
                        </Tooltip>
                    </div>
                    </div>
                } 
                {MOU &&
                  <div className="mou-icon">
                    <Tooltip placement="top" title="Click Here to Delete MOU">
                      <a href="#" className="menu_links" onClick={() => onDelete()}> <FaTrashAlt  size="27" color='#787B96' /> </a>
                    </Tooltip>
                  </div>
                }
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
