import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { Input } from "../../../../utils/Form";
import moment from "moment";
import { setAlert } from "../../../../store/reducers/Notifications/actions";
import * as Yup from "yup";
import { getAllMedhaUsers } from "../../../../utils/function/lookupOptions";

const Section = styled.div`
  padding-top: 30px;
  padding-bottom: 30px;
  &:not(:first-child) {
    border-top: 1px solid #c4c4c4;
  }
  .section-header {
    color: #207b69;
    font-family: "Latto-Regular";
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 15px;
  }
`;

const PMusEdit = (props) => {
  const { onHide, show, refreshTableOnDataSaving } = props;
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [medhaPocOptions, setMedhaPocOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const medhaUsers = await getAllMedhaUsers();
      setMedhaPocOptions(medhaUsers.map(user => ({ label: user.name, value: user.id })));
    };
    fetchOptions();
  }, []);

  let initialValues = {
    year: "",
    pmu: "",
    State: "",
    medha_poc: ""
  };
  if (props) {
    initialValues = {
      year: props.year ? moment(props.year).format("YYYY-MM-DD") : "",
      pmu: props.pmu || "",
      State: props.State || "",
      medha_poc: props.medha_poc?.id || ""
    };
  }

  const validationSchema = Yup.object().shape({
    year: Yup.date().required("Year is required"),
    pmu: Yup.string().required("PMU is required"),
    State: Yup.string().required("State is required"),
    medha_poc: Yup.string().required("Medha POC is required")
  });

  const onSubmit = async (values) => {
    setDisableSaveButton(true);
    // TODO: Call update API
    setAlert("PMus entry updated successfully", "success");
    if (typeof refreshTableOnDataSaving === "function") {
      await refreshTableOnDataSaving();
    }
    if (typeof onHide === "function") {
      onHide();
    }
    setDisableSaveButton(false);
  };

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={onHide}
      animation={false}
      aria-labelledby="contained-modal-title-vcenter"
      className="form-modal"
    >
      <Modal.Header className="bg-white">
        <Modal.Title id="contained-modal-title-vcenter" className="d-flex align-items-center">
          <h1 className="text--primary bebas-thick mb-0">Edit PMus</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Formik
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Section>
                <h3 className="section-header">PMus Information</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="year"
                      label="Year"
                      required
                      control="datepicker"
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="pmu"
                      label="PMU"
                      required
                      control="input"
                      className="form-control"
                      placeholder="Enter PMU"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <Input
                      name="State"
                      label="State"
                      required
                      control="input"
                      className="form-control"
                      placeholder="Enter State"
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-2">
                    <label>Medha POC</label>
                    <select
                      className="form-control"
                      name="medha_poc"
                      value={values.medha_poc}
                      onChange={e => setFieldValue("medha_poc", e.target.value)}
                    >
                      <option value="">Select...</option>
                      {medhaPocOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Section>
              <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary mr-2" onClick={onHide}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={disableSaveButton}>Save</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default PMusEdit; 