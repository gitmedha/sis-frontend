import moment from "moment";
import { connect } from "react-redux";
import { queryBuilder } from "../../apis";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import { Form, Input } from "../../utils/Form";
import { CREATE_NEW_BATCH } from "../../graphql";
import { batchValidations } from "../../validations";
import ImageUploader from "../../components/content/ImageUploader";
import { batchLookUpOptions } from "../../utils/function/lookupOptions";
import { setAlert } from "../../store/reducers/Notifications/actions";

const NewBatch = ({ setAlert }) => {
  const history = useHistory();
  const [logo, setLogo] = useState(null);
  const [addLogo, setAddLogo] = useState(null);
  // eslint-disable-next-line
  const [isLoading, setLoading] = useState(null);

  // LookUp Options
  const [options, setOptions] = useState(null);
  const [loopUpIsLoading, setLookUpLoading] = useState(false);

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
      setAlert("Batch addedd successfully.", "success");
    } catch (err) {
      console.log("BATCH_CREATE_ERR", err);
      setAlert("Unable to add batch.", "error");
    } finally {
      setLoading(false);
      history.push(`/batch/${newBatchId}`);
    }
  };

  const init = async () => {
    setLookUpLoading(true);
    let options = await batchLookUpOptions();
    setOptions(options);
    setLookUpLoading(false);
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
                <Input
                  control="input"
                  className="form-control"
                  name="name_in_current_sis"
                  label="Name in Current SIS"
                  placeholder="Name in Current SIS"
                />
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading ? (
                  <Input
                    control="lookup"
                    name="assigned_to"
                    label="Assigned To"
                    className="form-control"
                    placeholder="Assigned To"
                    options={options?.assigneesOptions}
                  />
                ) : (
                  <Skeleton count={1} height={58} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading ? (
                  <Input
                    name="program"
                    label="Program"
                    control="lookup"
                    placeholder="Program"
                    className="form-control"
                    options={options?.programOptions}
                  />
                ) : (
                  <Skeleton count={1} height={58} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading ? (
                  <Input
                    name="grant"
                    label="Grant"
                    control="lookup"
                    placeholder="Grant"
                    className="form-control"
                    options={options?.grantOptions}
                  />
                ) : (
                  <Skeleton count={1} height={58} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading && options ? (
                  <Input
                    control="lookup"
                    name="institution"
                    label="Institution"
                    className="form-control"
                    placeholder="Institution"
                    options={options?.instituteOptions}
                  />
                ) : (
                  <Skeleton count={1} height={58} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading ? (
                  <Input
                    icon="down"
                    name="status"
                    label="Status"
                    control="lookup"
                    placeholder="Status"
                    className="custom-select"
                    options={options?.statusOptions}
                  />
                ) : (
                  <Skeleton count={1} height={58} />
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

const mapStateToProps = (state) => ({});
const mapActionsToProps = {
  setAlert,
};

export default connect(mapStateToProps, mapActionsToProps)(NewBatch);
