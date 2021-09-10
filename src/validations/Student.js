import * as Yup from "yup";

const institution = Yup.string().required("Institution is required.");
const batch = Yup.string().required("Batch is required.");
const first_name  = Yup.string().required("First Name is required.");
const last_name  = Yup.string().required("Last Name is required.");
const phone  = Yup.string().required("Phone is required.");
const name_of_parent_or_guardian = Yup.string().required("Parent Name or Guardian Name is required.");
const category  = Yup.string().required("Category is required.");
const email  = Yup.string().required("Email is required.");
const gender  = Yup.string().required("Gender is required.");
const date_of_birth  = Yup.string().required("DOB is required.");
const income_level  = Yup.string().required("Batch is required.");
const logo  = Yup.string().required("Batch is required.");
const old_sis_id  = Yup.string().required("Batch is required.");
const course_type_latest  = Yup.string().required("Batch is required.");
const medha_champion  = Yup.string().required("Batch is required.");
const interested_in_employment_opportunities  = Yup.string().required("Batch is required.");
const CV  = Yup.string().required("Batch is required.");
const status  = Yup.string().required("Status is required.");
const course_level  = Yup.string().required("Course Level is required.");
const year_of_course_completion = Yup.string().required("Year of Completion is required.");
const course_year = Yup.string().required("Course Year is required.");
const course_name_in_current_sis = Yup.string().required("Course Name is required.");
const course_type = Yup.string().required("Course Type is required.");
const registration_date = Yup.string().required("Registration Date is required.");
const fee_status = Yup.string().required("Fee Status is required.");

export const ProgramEnrollmentValidations = Yup.object({
  institution,
  batch,
  status,
  course_year,
  course_name_in_current_sis,
  course_level,
  course_type,
  year_of_course_completion,
  registration_date,
  fee_status
});

export const StudentValidations =Yup.object({
  first_name,
  last_name,
  phone,
  name_of_parent_or_guardian,
  category,
  email,
  gender,
  date_of_birth,
  income_level,
  logo,
  old_sis_id,
  course_type_latest,
  medha_champion,
  interested_in_employment_opportunities,
  CV
});

