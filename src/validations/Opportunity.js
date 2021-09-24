import * as Yup from "yup";

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


export const OpportunityValidations = Yup.object({
  status,
  assigned_to,
  type,
  employer,
  role_or_designation,
  number_of_opportunities,
  department_or_team,
  salary,
  compensation_type,
  skills_required,
  role_description,
});

export const EmployerOpportunityValidations = Yup.object({
  status,
  assigned_to,
  type,
  role_or_designation,
  number_of_opportunities,
  department_or_team,
  salary,
  compensation_type,
  skills_required,
  role_description,
});
