// Gender options for Select components
// ... existing code ...

export const quarterOptions = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
  { value: "Q1-Q4", label: "Q1-Q4" },
];

export const categoryOptions = [
  { value: "Student Outreach", label: "Student Outreach" },
  { value: "Placements", label: "Placements" },
  { value: "Internship", label: "Internship" },
  { value: "Apprenticeship", label: "Apprenticeship" },
  { value: "  Indirect Placements", label: "  Indirect Placements" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "Students moving to a higher degree", label: "Students moving to a higher degree" },
  { value: "Moving from one year to another", label: "Moving from one year to another" },
  { value: "Other - (Graduating from the course/Not participating in labour force)", label: "Other - (Graduating from the course/Not participating in labour force)" },
];  

// Month options for the Select component
export const monthOptions = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export const stateOptions = [
  { value: "Haryana", label: "Haryana" },
  { value: "Bihar", label: "Bihar" },
  { value: "UttarPradesh", label: "Uttar Pradesh" },
  { value: "Uttarkhand", label: "Uttarakhand" },
];

// State to department/project mapping
export const STATE_DEPARTMENT_MAP = {
  Haryana: [
    { value: "Department of Higher Education", label: "Department of Higher Education" },
    { value: "Department of Technical Education,Haryana", label: "Department of Technical Education,Haryana" },
    { value: "Dual System of Training,Haryana", label: "Dual System of Training,Haryana" },
    { value: "Skill Development of Industrial Training,Haryana", label: "Skill Development of Industrial Training,Haryana" },
  ],
  Bihar: [
    { value: "Department of Labor and Resource,Bihar", label: "Department of Labor and Resource,Bihar" },
  ],
  UttarPradesh: [
    { value: "DVEDSE,UP", label: "DVEDSE,UP" },
    { value: "Department of Secondary Education,UP(Svapoorna)", label: "Department of Secondary Education,UP(Svapoorna)" },
    { value: "ISTE,UP", label: "ISTE,UP" },
    { value: "STPC,UP", label: "STPC,UP" },
  ],
  Uttarkhand: [
    { value: "UKWDP,Uttarkhand", label: "UKWDP,Uttarkhand" },
  ],
};

// Institution type mapping
export const INSTITUTION_TYPE_OPTIONS_MAP = {
  Haryana: {
    "Department of Higher Education": [{ value: "Higher Education", label: "Higher Education" }],
    "Department of Technical Education,Haryana": [{ value: "Polytechnic", label: "Polytechnic" }],
    "Dual System of Training,Haryana": [{ value: "ITI", label: "ITI" }],
    "Skill Development of Industrial Training,Haryana": [{ value: "ITI", label: "ITI" }],
  },
  Bihar: {
    "Department of Labor and Resource,Bihar": [{ value: "ITI", label: "ITI" }],
  },
  UttarPradesh: {
    "DVEDSE,UP": [{ value: "ITI", label: "ITI" }],
    "Department of Secondary Education,UP(Svapoorna)": [{ value: "Secondary Education", label: "Secondary Education" }],
    "ISTE,UP": [{ value: "Polytechnic", label: "Polytechnic" }],
    "STPC,UP": [{ value: "Technical", label: "Technical" }],
  },
  Uttarkhand: {
    "UKWDP,Uttarkhand": [{ value: "ITI", label: "ITI" }],
  }
}; 