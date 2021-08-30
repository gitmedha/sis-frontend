import * as Yup from "yup";

const institution = Yup.string().required("Institution is required.");
const batch = Yup.string().required("Batch is required.");

export const ProgramEnrollmentValidations = Yup.object({
  institution,
  batch,
});
