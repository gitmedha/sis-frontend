import * as Yup from "yup";

const name = Yup.string().required("Name is required.");
const status = Yup.string().required("Status is required.");
const type = Yup.string().required("College type is required.");
const last_name = Yup.string().required("Last name is required.");
const full_name = Yup.string().required("First name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const designation = Yup.string().required("Designation is required.");
const website = Yup.string().required("Website of college is required.");
const email = Yup.string()
  .email("Please enter an valid email.")
  .required("Email is required.");

const phone = Yup.string().required("Phone Number is required.");
const city = Yup.string().required("City is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address_line = Yup.string().required("Address is required.");
const pin_code = Yup.number("Should be a number.").required(
  "Pincode is required."
);

export const InstituteValidations = Yup.object({
  name,
  type,
  email,
  phone,
  status,
  website,
  // assigned_to,
});

export const AddressValidations = Yup.object({
  state,
  pin_code,
  medha_area,
  address_line,
});

export const ContactValidations = Yup.object({
  email,
  phone,
  full_name,
  designation,
});

export const NewInstituteValidations = Yup.object({
  name,
  type,
  email,
  phone,
  state,
  status,
  website,
  pin_code,
  medha_area,
  assigned_to,
  address_line,
});
