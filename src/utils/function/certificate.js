export const generateCertificate = async (programEnrollmentId) => {
  let url = `${process.env.REACT_APP_STRAPI_API_BASEURL}/program-enrollments/${programEnrollmentId}/generateCertificate`;
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return await response.json();
}
