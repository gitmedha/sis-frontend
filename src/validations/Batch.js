import * as Yup from "yup";

const topics = Yup.string().required("Topic covered is required.");
const date = Yup.string().required("Session Date is required.");

export const sessionValidations = Yup.object({
  date,
  topics,
});
