import moment from "moment";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { queryBuilder } from "../../../apis";
import Skeleton from "react-loading-skeleton";
import { UPDATE_BATCH } from "../../../graphql";
import { Form, Input } from "../../../utils/Form";
import { batchValidations } from "../../../validations";
import { batchLookUpOptions } from "../../../utils/function/lookupOptions";

const UpdateBatchDetails = (props) => {
  const { onHide, show } = props;
  const [options, setOptions] = useState(null);
  const [isUpdating, setUpdating] = useState(false);
  const [loopUpIsLoading, setLookUpLoading] = useState(false);

  const originalVal = {
    ...JSON.parse(JSON.stringify(props.batch)),
    grant: Number(props.batch.grant.id),
    program: Number(props.batch.program.id),
    end_date: new Date(props.batch.end_date),
    start_date: new Date(props.batch.start_date),
    institution: Number(props.batch.institution.id),
    assigned_to: Number(props.batch.assigned_to.id),
  };

  const prepareLookUpFields = async () => {
    setLookUpLoading(true);
    let lookUpOpts = await batchLookUpOptions();
    setOptions(lookUpOpts);
    setLookUpLoading(false);
  };

  useEffect(() => {
    if (show && !options) {
      prepareLookUpFields();
    }
    // eslint-disable-next-line
  }, [show]);

  const onSubmit = async (values) => {
    setUpdating(true);
    try {
      delete values["id"];
      delete values["logo"];
      delete values["created_at"];
      delete values["updated_at"];

      await queryBuilder({
        query: UPDATE_BATCH,
        variables: {
          data: {
            ...values,
            end_date: moment(values.end_date).format("YYYY-MM-DD"),
            start_date: moment(values.start_date).format("YYYY-MM-DD"),
          },
          id: Number(props.batch.id),
        },
      });
    } catch (err) {
      console.log("BATCH_UPDATE_ERR", err);
    } finally {
      setUpdating(false);
      onHide("updated");
    }
  };

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header className="bg-light">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text--primary latto-bold"
        >
          Update Batch
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light container">
        <Form
          onSubmit={onSubmit}
          initialValues={originalVal}
          validationSchema={batchValidations}
        >
          {!isUpdating ? (
            <div className="row">
              <div className="col-md-6 col-sm-12 mt-2">
                <Input
                  name="name"
                  label="Name"
                  control="input"
                  placeholder="Name"
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
                  <Skeleton count={1} height={45} />
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
                  <Skeleton count={1} height={45} />
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
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading ? (
                  <Input
                    label="Institution"
                    name="institution"
                    control="lookup"
                    placeholder="Institution"
                    className="form-control"
                    options={options?.instituteOptions}
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
              </div>
              <div className="col-md-6 col-sm-12 mt-2">
                {!loopUpIsLoading ? (
                  <Input
                    name="status"
                    label="Status"
                    control="lookup"
                    placeholder="Status"
                    className="form-control"
                    options={options?.statusOptions}
                  />
                ) : (
                  <Skeleton count={1} height={45} />
                )}
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
            </div>
          ) : (
            <Skeleton height={66} count={6} />
          )}
          <div className="d-flex justify-content-end mt-2 py-4">
            <button
              type="submit"
              className="btn--primary"
              style={{ marginLeft: "0px" }}
            >
              SAVE
            </button>
            <button
              type="button"
              onClick={() => onHide()}
              className="btn--secondary"
              style={{ marginLeft: "5px" }}
            >
              CANCEL
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBatchDetails;
