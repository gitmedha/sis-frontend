import * as Yup from "yup";

const name = Yup.string().required("Name is required.");
const status = Yup.string().required("Status is required.");
const full_name = Yup.string().required("Name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const designation = Yup.string().required("Designation is required.");
const email = Yup.string()
  .email("Please enter a valid email.")
  .required("Email is required.");
const phone = Yup.string().required("Phone Number is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address = Yup.string().required("Address is required.");
const pin_code = Yup.number("Should be a number.").required(
  "Pincode is required.");
const type = Yup.string().required("Type is required.");
const industry = Yup.string().required("Industry is required.");
const city = Yup.string().required("City is required.");

const contacts = Yup.array().of(
  Yup.object({
    full_name,
    email,
    phone,
    designation,
  })
);

export const EmployerValidations = Yup.object({
    name,
    type,
    status,
    phone,
    assigned_to,
    industry,
    address,
    medha_area,
    state,
    city,
    pin_code,
    contacts,
});

export const ContactValidations = Yup.object({
  phone,
  full_name,
  designation,
  email,
});
