import {
  GET_ALL_GRANTS,
  GET_ALL_PROGRAMS,
  GET_ALL_INSTITUTES,
  GET_ASSIGNEES_LIST,
} from "../../graphql";

import { queryBuilder } from "../../apis";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Form, Input } from "../../utils/Form";
import ImageUploader from "../../components/content/ImageUploader";

const NewBatch = () => {
  const [logo, setLogo] = useState(null);
  const [grants, setGrants] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setLoading] = useState(null);
  const logoUploadHandler = ({ id }) => setLogo(id);
  const [assigneeOpts, setAssignees] = useState([]);
  const [institutions, setInstitutions] = useState([]);

  const batchDetails = {
    name: "",
    grant: "",
    status: "",
    program: "",
    end_date: "",
    start_date: "",
    institution: "",
    per_student_fees: "",
    name_in_current_sis: "",
    number_of_sessions_planned: "",
    // TODO: default set to the authenticated user's ID
    assigned_to: "",
  };

  const statusOpts = [
    { key: "Enrollment Ongoing", value: "Enrollment Ongoing" },
    { key: "To Be Started", value: "To Be Started" },
    { key: "In Progress", value: "In Progress" },
    { key: "Complete", value: "Complete" },
    { key: "Certified", value: "Certified" },
    { key: "Discontinued", value: "Discontinued" },
  ];

  const onSubmit = async (data) => console.log("DATA", data);

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
  }, []);

  //   console.log("GRANTS", grants);

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
            // validationSchema={NewInstituteValidations}
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
                    control="select"
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
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewBatch;
