import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { getMyDataMetricsGraph } from "../../views/Dashboard/components/DashboardActions";
import moment from "moment";

const ProgramEnrollmentChart = (props) => {
  const userId = Number(localStorage.getItem("user_id")) || 2;
  const [options, setOptions] = useState({
    chart: {
      height: 280,
      type: "area",
      toolbar: {
        show: true,
        tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: []
          },
      },
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
  });
  const [series, setSeries] = useState([
    {
      name: "Registrations",
      data: []
    },
    {
      name: "Certifications",
      data: []
    }
  ]);

  useEffect(() => {
    getMyDataMetricsGraph(userId, 'registrations').then(data => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      let registrationDataArray = (data.data.data.programEnrollmentsConnection.groupBy.registration_date).filter(({key}) => (new Date(key)) > sixMonthsAgo);

      // set key = date and value = count
      let registrationData = {};
      registrationDataArray.map(item => {
        registrationData[item.key] = item.connection.aggregate.count;
      });
      // sort the data by date
      // registrationData = Object.keys(registrationData).sort().reduce((obj, key) => {
      //   obj[key] = registrationData[key];
      //   return obj;
      // }, {});
      
      let aggregateDate = [];
      Object.keys(registrationData).sort().forEach(date => {
        let registrationCount = registrationData[date];
        let yearMonth = moment(date).format('yy-MMM');
        
        if (aggregateDate[yearMonth] === undefined) {
          aggregateDate[yearMonth] = registrationCount; 
        } else {
          aggregateDate[yearMonth] += registrationCount; 
        }
        
        setOptions({
          xaxis: {
            categories: Object.keys(aggregateDate)
          }
        })
        
        setSeries([
          {
            name: "Registrations",
            data: Object.values(aggregateDate)
          },
          {
            name: "Certifications",
            data: ["2", "4", "5","2"]
          }
        ])
      });
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
