import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { getMyDataMetricsGraph } from "../../views/Dashboard/components/DashboardActions";

const ProgramEnrollmentChart = (props) => {
  const userId = Number(localStorage.getItem("user_id")) || 2;
  const [options, setOptions] = useState({
    chart: {
      height: 280,
      type: "area"
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: [
        "Jan 2021",
        "Feb 2021",
        "Mar 2021",
        "Apr 2021",
        "May 2021",
        "Jun 2021",
        "Aug 2021"
      ]
    }
  });
  const [series, setSeries] = useState([
    {
      name: "Registrations",
      data: [30000, 52000, 38000, 45000, 19000, 23000, 2000]
    },
    {
      name: "Certifications",
      data: [35000, 35000, 40000, 25000, 44000, 55000, 75000],
    }
  ]);

  useEffect(() => {
    getMyDataMetricsGraph(userId, 'registrations').then(data => {
      let registrationDataArray = data.data.data.programEnrollmentsConnection.groupBy.registration_date;
      // set key = date and value = count
      let registrationData = {};
      registrationDataArray.map(item => {
        registrationData[item.key] = item.connection.aggregate.count;
      });
      registrationData = Object.keys(registrationData).sort().reduce((obj, key) => {
        obj[key] = registrationData[key];
        return obj;
      }, {});
      console.log('sorted registrationData', registrationData);
    });
  }, []);

  return (
    <Chart
      options={options}
      series={series}
      type="area"
    />
  )
};

export default ProgramEnrollmentChart;
