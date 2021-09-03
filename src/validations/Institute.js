import * as Yup from "yup";

const name = Yup.string().required("Name is required.");
const status = Yup.string().required("Status is required.");
const type = Yup.string().required("College type is required.");
const full_name = Yup.string().required("Name is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const designation = Yup.string().required("Designation is required.");
const website = Yup.string().required("Website of college is required.");
const email = Yup.string()
  .email("Please enter a valid email.")
  .required("Email is required.");
const phone = Yup.string().required("Phone Number is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address = Yup.string().required("Address is required.");
const city = Yup.string().required("City is required.");
const pin_code = Yup.number("Should be a number.").required(
  "Pincode is required."
);
const address_line = Yup.object({
  state,
  medha_area,
  address,
  pin_code,
  city
});
const contacts = Yup.array().of(
  Yup.object({
    full_name,
    email,
    phone,
    designation,
  })
);

export const InstituteValidations = Yup.object({
  name,
  type,
  email,
  phone,
  status,
  website,
  assigned_to,
  address,
  contacts,
  state,
  pin_code,
  city,
  medha_area
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
  address,
  city,
});
