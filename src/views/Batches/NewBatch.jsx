import {
  GET_ALL_GRANTS,
  GET_ALL_PROGRAMS,
  CREATE_NEW_BATCH,
  GET_ALL_INSTITUTES,
  GET_ASSIGNEES_LIST,
} from "../../graphql";
import moment from "moment";
import { queryBuilder } from "../../apis";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Form, Input } from "../../utils/Form";
import { useHistory } from "react-router-dom";
import { batchValidations } from "../../validations";
import ImageUploader from "../../components/content/ImageUploader";

const NewBatch = () => {
  const history = useHistory();
  const [logo, setLogo] = useState(null);
  const [grants, setGrants] = useState([]);
  const [addLogo, setAddLogo] = useState(null);
  const [programs, setPrograms] = useState([]);
  // eslint-disable-next-line
  const [isLoading, setLoading] = useState(null);
  const [assigneeOpts, setAssignees] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const logoUploadHandler = ({ id }) => setLogo(id);
  const addLogoUploadHandler = ({ id }) => setAddLogo(id);

  const batchDetails = {
    name: "",
    grant: "",
    status: "",
    program: "",
    end_date: "",
    start_date: "",
    institution: "",
    per_student_fees: "",
    seats_available: "0000",
    name_in_current_sis: "",
    number_of_sessions_planned: "",
    include_institution_logo_in_certificates: "yes",
    // TODO: default set to the authenticated user's ID
    assigned_to: "",
  };

  const statusOpts = [
    {
      label: "Enrollment Ongoing",
      key: "Enrollment Ongoing",
      value: "Enrollment Ongoing",
    },
    { label: "To Be Started", key: "To Be Started", value: "To Be Started" },
    { label: "In Progress", key: "In Progress", value: "In Progress" },
    { label: "Complete", key: "Complete", value: "Complete" },
    { label: "Certified", key: "Certified", value: "Certified" },
    { label: "Discontinued", key: "Discontinued", value: "Discontinued" },
  ];

  const onSubmit = async (values) => {
    let { include_institution_logo_in_certificates } = values;
    let newBatchId;
    delete values["seats_available"];

    values.include_institution_logo_in_certificates =
      include_institution_logo_in_certificates === "yes";

    setLoading(true);
    try {
      let data = await queryBuilder({
        query: CREATE_NEW_BATCH,
        variables: {
          data: {
            ...values,
            start_date: moment(values.start_date).format("YYYY-MM-DD"),
            end_date: moment(values.end_date).format("YYYY-MM-DD"),
            additional_logos_for_certificates: addLogo,
            logo: logo,
          },
        },
      });
      newBatchId = data.data.createBatch.batch.id;
    } catch (err) {
      console.log("BATCH_CREATE_ERR", err);
    } finally {
      setLoading(false);
      history.push(`/batch/${newBatchId}`);
    }
  };

  const getAssignees = async () => {
    let data = await queryBuilder({
      query: GET_ASSIGNEES_LIST,
    });

    let newAssignees = data.data.users.map((assignee) => ({
      key: assignee.username,
      label: assignee.username,
      value: Number(assignee.id),
    }));

    setAssignees(newAssignees);
  };

  const getPrograms = async () => {
    let data = await queryBuilder({
      query: GET_ALL_PROGRAMS,
    });
    let programOptions = data.data.programs.map((program) => ({
      key: program.name,
      label: program.name,
      value: Number(program.id),
    }));
    setPrograms(programOptions);
  };

  const getGrants = async () => {
    let data = await queryBuilder({
      query: GET_ALL_GRANTS,
    });
    let grantOptions = data.data.grants.map((grant) => ({
      key: grant.name,
      label: grant.name,
      value: Number(grant.id),
    }));
    setGrants(grantOptions);
  };

  const getAllInstitutes = async () => {
    let data = await queryBuilder({
      query: GET_ALL_INSTITUTES,
    });
    let instituteOptions = data.data.institutions.map((institution) => ({
      key: institution.name,
      label: institution.name,
      value: Number(institution.id),
    }));
    setInstitutions(instituteOptions);
  };

  const init = async () => {
    setLoading(true);
    await getAssignees();
    await getPrograms();
    await getGrants();
    await getAllInstitutes();
    setLoading(false);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="card">
      <div className="card-header bg-white py-2 mt-2">
        <h1 className="bebas-thick text--primary">Add New Batch</h1>
      </div>
      <div className="card-body py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <ImageUploader handler={logoUploadHandler} />
            </div>
          </div>
          <Form
            onSubmit={onSubmit}
            initialValues={batchDetails}
            validationSchema={batchValidations}
          >
            <div className="row">
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="name"
                  control="input"
                  label="Batch Name"
                  className="form-control"
                  placeholder="Batch Name"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {assigneeOpts.length ? (
                  <Input
                    control="lookup"
                    name="assigned_to"
                    label="Assigned To"
                    options={assigneeOpts}
                    className="form-control"
                    placeholder="Assigned To"
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {programs.length ? (
                  <Input
                    name="program"
                    label="Program"
                    control="lookup"
                    options={programs}
                    placeholder="Program"
                    className="form-control"
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {statusOpts.length ? (
                  <Input
                    name="status"
                    label="Status"
                    control="lookup"
                    placeholder="Status"
                    options={statusOpts}
                    className="form-control"
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {grants.length ? (
                  <Input
                    name="grant"
                    label="Grant"
                    control="lookup"
                    options={grants}
                    placeholder="Grant"
                    className="form-control"
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {institutions.length ? (
                  <Input
                    control="lookup"
                    name="institution"
                    label="Institution"
                    options={institutions}
                    className="form-control"
                    placeholder="Institution"
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="start_date"
                  label="Start Date"
                  control="datepicker"
                  className="form-control"
                  placeholder="Start Date"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="end_date"
                  label="End Date"
                  control="datepicker"
                  placeholder="End Date"
                  className="form-control"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  control="input"
                  className="form-control"
                  name="name_in_current_sis"
                  label="Name in Current SIS"
                  placeholder="Name in Current SIS"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  min={0}
                  type="number"
                  control="input"
                  className="form-control"
                  name="number_of_sessions_planned"
                  label="Number of sessions planned"
                  placeholder="Number of sessions planned"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  min={0}
                  type="number"
                  control="input"
                  className="form-control"
                  name="per_student_fees"
                  label="Per Student Fees"
                  placeholder="Per Student Fees"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  min={0}
                  type="number"
                  control="input"
                  disabled={true}
                  name="seats_available"
                  label="Seats Available"
                  className="form-control"
                  placeholder="Seats Available"
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="row">
              <p className="title-text text--primary latto-bold">
                Certification Details
              </p>
              <div className="col-md-6 col-sm-12">
                <Input
                  control="radio"
                  className="form-control"
                  label="Include Logo in Certificate?"
                  name="include_institution_logo_in_certificates"
                  options={[
                    // { key: "Yes", value: true },
                    // { key: "No", value: false },
                    { key: "Yes", value: "yes" },
                    { key: "No", value: "no" },
                  ]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <ImageUploader handler={addLogoUploadHandler} label={null} />
              </div>
            </div>
            <div className="d-flex mt-2 py-4">
              <button
                type="submit"
                style={{ marginLeft: "0px" }}
                className="btn btn-primary btn-regular"
              >
                SAVE
              </button>
              <button
                type="button"
                style={{ marginLeft: "20px" }}
                onClick={() => history.goBack()}
                className="btn btn-primary btn-regular"
              >
                CANCEL
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewBatch;
