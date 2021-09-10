import * as Yup from "yup";

const institution = Yup.string().required("Institution is required.");
const batch = Yup.string().required("Batch is required.");
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


