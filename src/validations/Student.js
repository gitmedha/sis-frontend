import * as Yup from "yup";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const pincodeRegExp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/

// Program Enrollment form fields.
const institution = Yup.string().required("Institution is required.");
const batch = Yup.string().required("Batch is required.");
const program_enrollment_status = Yup.string().required("Status is required.");
const course_year = Yup.string().nullable().required("Course Year is required.");
const course_name_in_current_sis = Yup.string().nullable().required("Course Name is required.");
const course_level = Yup.string().nullable().required("Course Level is required.");
const course_type = Yup.string().nullable().required("Course Type is required.");
const year_of_course_completion = Yup.string().nullable().required("Year of Completion is required.");
const registration_date = Yup.date().nullable().required("Registration Date is required.");
const fee_status = Yup.string().required("Fee Status is required.");

// Employment Connection form fields.
const start_date = Yup.date().nullable().required("Start Date is required.");
const end_date = Yup.date().nullable().required("End Date is required.")
                    .when(
                      "start_date",
                      (start_date, schema) => start_date && schema.min(start_date, "End date can't be before Start date")
                    );
const employment_connection_status = Yup.string().nullable().required("Employment Connection status is required.");
const employer_id = Yup.string().required("Employer is required.");
const opportunity_id = Yup.string().required("Opportunity is required.");
const source = Yup.string().required("Source is required.");
const salary_offered = Yup.number().nullable().required("Salary Offered is required.")
                          .min(0, 'Min value 0.')
                          .max(1000000, 'Salary should be in range of between 0 to 10 Lakh.');

// Student form fields.
const first_name  = Yup.string().required("First Name is required.");
const last_name  = Yup.string().required("Last Name is required.");
const phone = Yup.string()
  .matches(phoneRegExp, 'Phone number is not valid')
  .min(10, "Number is too short")
  .max(10, "Number is too long")
  .required("Phone Number is required.");
const name_of_parent_or_guardian = Yup.string().nullable().required("Parent Name or Guardian Name is required.");
const email  = Yup.string().required("Email is required.");
const gender  = Yup.string().nullable().required("Gender is required.");
const date_of_birth  = Yup.date().nullable().required("DOB is required.");
const category  = Yup.string().nullable().required("Category is required.");
const assigned_to = Yup.string().required("Assigned To is required.");
const student_status  = Yup.string().required("Status is required.");
const income_level  = Yup.string().nullable().required("Income Level is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address = Yup.string().required("Address is required.");
const pin_code = Yup.string("Should be a number.")
  .matches(pincodeRegExp, 'Pincode is not valid')
  .max(6, "Pincode is too long")
  .required("Pincode is required.");
const city = Yup.string().required("City is required.");

export const ProgramEnrollmentValidations = Yup.object({
  institution,
  batch,
  status: program_enrollment_status,
  course_year,
  course_name_in_current_sis,
  course_level,
  course_type,
  year_of_course_completion,
  registration_date,
  fee_status,
});

export const EmploymentConnectionValidations = Yup.object({
  start_date,
  end_date,
  status: employment_connection_status,
  employer_id,
  opportunity_id,
  source,
  salary_offered,
});

export const StudentValidations = Yup.object({
  first_name,
  last_name,
  phone,
  name_of_parent_or_guardian,
  category,
  email,
  gender,
  date_of_birth,
  assigned_to,
  status: student_status,
  income_level,
  city,
  pin_code,
  medha_area,
  address,
  state,
});
