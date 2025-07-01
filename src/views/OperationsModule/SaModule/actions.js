
export const getFieldValues = async (id) => {
  const response = await fetch(`/api/sa/ecosystem/${id}/fields`, {});
  if (!response.ok) {       
    throw new Error(`Error fetching field values: ${response.statusText}`);
  } 
    const data = await response.json();
    return data;
}
export const deactivate_ecosystem_entry = async (id) => {

}

export const updateEcosystemEntry = async (id, data) => {

}