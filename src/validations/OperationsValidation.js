import * as Yup from "yup";

const pincodeRegExp = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
const status = Yup.string().required("Status is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const type = Yup.string().required("Type is required.");
const employer = Yup.string().required("Employer is required.");
const role_or_designation = Yup.string().required("Role/Designation is required.");
const number_of_opportunities = Yup.string().required("No. of opportunities is required.");
const department_or_team = Yup.string().required("Department/Team is required.");
const salary = Yup.string().required("Salary is required.");
const compensation_type = Yup.string().required("Paid/Unpaid is required.");
const skills_required = Yup.string().required("Skills required is required.");
const role_description = Yup.string().required("Description is required.");
const state = Yup.string().required("State is required.");
const medha_area = Yup.string().required("Medha area is required.");
const address = Yup.string().required("Address is required.");
const pin_code = Yup.string("Should be a number.")
  .matches(pincodeRegExp, 'Pincode is not valid')
  .max(6, "Pincode is too long")
  .required("Pincode is required.");
const city = Yup.string().required("City is required.");
const district= Yup.string().required("District is required.");
const email  = Yup.string().required("Email is required.");



export const mentorshipValidations = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    contact: Yup.string()
      .min(10, 'Contact must be at least 10 digits')
      .required('Contact is required'),
    mentor_name: Yup.string().required('Mentor name is required'),
    mentor_area: Yup.string().required('Mentor area is required'),
    mentor_domain: Yup.string().required('Mentor domain is required'),
    mentor_company_name: Yup.string().required('Mentor company name is required'),
    assigned_to: Yup.string().required('Assigned to is required'),
    program_name: Yup.string().required('Program name is required'),
    onboarding_date: Yup.date().required('Onboarding date is required'),
    mentor_state: Yup.string().required('Mentor state is required'),
    medha_area: Yup.string().required('Medha area is required'),
    status: Yup.string().oneOf(['Connected', 'Pipeline', 'Dropped out'], 'Invalid status').required('Status is required'),
    outreach: Yup.string().nullable().oneOf(['Online', 'Offline'], 'Invalid status').required('Outreach is required')
  });