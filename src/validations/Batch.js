import * as Yup from "yup";

const topics = Yup.string().required("Topic covered is required.");
const date = Yup.date().nullable().required("Session Date is required.");

// New Batch Validation Rules
const name = Yup.string().required("Name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const grant = Yup.string().required("Grant for batch is required.");
const status = Yup.string().required("Status of batch is required.");
const end_date = Yup.date().nullable().required("End Date of batch is required.")
                    .when(
                        "start_date",
                        (start_date, schema) => start_date && schema.min(start_date, "End date can't be before Start date")
                    );
const program = Yup.string().required("Program for the batch is required.");
const start_date = Yup.date().nullable().required("Start Date of batch is required.");
const institution = Yup.string().required("Institution for batch is required.");
const per_student_fees = Yup.string().required("Fees per student is required.");
const seats_available = Yup.string().required("Seats Available is required.");
const name_in_current_sis = Yup.string().required(
  "Name In Current SIS is required."
);
const number_of_sessions_planned = Yup.string().required(
  "Total number of sessions planned is required."
);

export const sessionValidations = Yup.object({
  date,
  topics,
});

export const BatchValidations = Yup.object({
  name,
  grant,
  status,
  program,
  end_date,
  start_date,
  assigned_to,
  institution,
  per_student_fees,
  name_in_current_sis,
  number_of_sessions_planned,
  seats_available,
});
