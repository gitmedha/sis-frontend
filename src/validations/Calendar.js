import * as Yup from "yup";

const status = Yup.string().required("Status is required.");
const assigned_to = Yup.string().required("Assignee is required.");
const start_date = Yup.string().required("Start Date is required.");
const end_date = Yup.string().required("End Date is required.");
const alumni_service = Yup.string().required("Alumni Service is required.");
const reporting_date = Yup.string().required("Reporting Date is required");


export const calendarValidations = Yup.object({
    status,
    assigned_to,
    start_date,
    end_date,
    alumni_service,
    reporting_date
})