import React from "react";

const TotEdit = () => {
  return (
    <>
      {initialValues && props && (
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
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="d-flex align-items-center"
            >
              {props.id && props.logo ? (
                <img
                  src={urlPath(props.logo.url)}
                  className="avatar mr-2"
                  alt="Student Profile"
                />
              ) : (
                <div className="flex-row-centered avatar avatar-default mr-2">
                  <FaSchool size={25} />
                </div>
              )}
              <h1 className="text--primary bebas-thick mb-0">
                {props.id ? props.full_name : "Add New Student"}
              </h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-white">
            <Formik onSubmit={onSubmit} initialValues={initialValues}>
              {({ values, setFieldValue }) => (
                <Form>
                  <Section>
                    <h3 className="section-header">Basic Info</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="activity_type"
                          label="Activity Type"
                          className="form-control"
                          placeholder="Activity Type"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="assigned_to"
                          label="Assigned To"
                          required
                          className="form-control"
                          placeholder="Assigned To"
                          filterData={filterAssignedTo}
                          defaultOptions={assigneeOptions}
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="batch"
                          label="Batch"
                          required
                          filterData={filterBatch}
                          defaultOptions={batchOptions}
                          className="form-control1"
                          placeholder="Batch"
                        />

                        {/* <Input
                            control="lookupAsync"
                            name="batch"
                            label="Batch"
                            required
                            filterData={filterBatch}
                            defaultOptions={props.id ? batchOptions : true}
                            className="form-control"
                            placeholder="Batch"
                          /> */}
                        {/* <Field name="batch">
                            {({ field, form }) => (
                              <AsyncSelect
                                {...field}
                                options={batchOptions}
                                placeholder="Select an option"
                                // isClearable
                                value={batchOptions ? batchOptions.find((option) => option.value === props.batch.id) || null : null}
                                onChange={filterBatch}
                                onBlur={() => form.setFieldTouched(field.name, true)}
                              />
                            )}
                          </Field> */}
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="lookupAsync"
                          name="institution"
                          label="Institution"
                          filterData={filterInstitution}
                          defaultOptions={institutionOptions}
                          placeholder="Institution"
                          className="form-control"
                          isClearable
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="start_date"
                          label="Start Date "
                          // required
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="end_date"
                          label="End Date"
                          // required
                          placeholder="Date of Birth"
                          control="datepicker"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="donor"
                          label="Donor"
                          // required
                          className="form-control"
                          placeholder="Donor"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          control="input"
                          name="topic"
                          label="Topic"
                          // required
                          className="form-control"
                          placeholder="Topic"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          icon="down"
                          control="input"
                          name="guest"
                          label="Guest"
                          // required
                          className="form-control"
                          placeholder="Guest"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* {genderOptions.length ? ( */}
                        <Input
                          icon="down"
                          control="input"
                          name="designation"
                          label="Designation"
                          // required
                          // options={genderOptions}
                          className="form-control"
                          placeholder="Designation"
                        />
                        {/* ) : ( */}
                        {/* <Skeleton count={1} height={45} /> */}
                        {/* )} */}
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {/* {genderOptions.length ? ( */}
                        <Input
                          icon="down"
                          control="input"
                          name="organization"
                          label="Organization"
                          // required
                          // options={genderOptions}
                          className="form-control"
                          placeholder="Organization"
                        />
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        <Input
                          name="students_attended"
                          label="Student Attended"
                          // required
                          placeholder="Student atended"
                          control="input"
                          className="form-control"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </Section>
                  <Section>
                    <h3 className="section-header">Address</h3>
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-2">
                        {stateOptions.length ? (
                          <Input
                            icon="down"
                            name="state"
                            label="State"
                            control="lookup"
                            options={stateOptions}
                            onChange={onStateChange}
                            placeholder="State"
                            className="form-control"
                            // required
                          />
                        ) : (
                          <Skeleton count={1} height={45} />
                        )}
                      </div>
                      <div className="col-md-6 col-sm-12 mb-2">
                        {areaOptions.length ? (
                          <Input
                            icon="down"
                            name="area"
                            label="Area"
                            control="lookup"
                            options={areaOptions}
                            // onChange={onStateChange}
                            placeholder="Area"
                            className="form-control"
                            // required
                          />
                        ) : (
                          <>
                            <Skeleton count={1} height={45} />
                          </>
                        )}
                      </div>
                    </div>
                  </Section>

                  <Section>
                    <h3 className="section-header">Other Information</h3>
                    <div className="row">
                      <div className="col-md-6">
                        <DetailField
                          label="Updated By"
                          value={
                            props.Updated_by?.userName
                              ? props.Updated_by?.userName
                              : props.Created_by?.username
                          }
                        />
                        <DetailField
                          label="Updated At"
                          value={moment(
                            props.updated_at
                              ? props.updated_at
                              : props.created_at
                          ).format("DD MMM YYYY, h:mm a")}
                        />
                      </div>
                      <div className="col-md-6">
                        <DetailField
                          label="Creted By"
                          value={
                            props.Created_by?.username
                              ? props.Created_by?.username
                              : ""
                          }
                        />
                        <DetailField
                          label="Created At "
                          value={moment(props.created_at).format(
                            "DD MMM YYYY, h:mm a"
                          )}
                        />
                      </div>
                    </div>
                  </Section>

                  <div className="row mt-3 py-3">
                    <div className="d-flex justify-content-start">
                      <button
                        className="btn btn-primary btn-regular mx-0"
                        type="submit"
                        disabled={disableSaveButton}
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        onClick={onHide}
                        className="btn btn-secondary btn-regular mr-2"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default TotEdit;
