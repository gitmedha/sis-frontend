import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { getMyDataMetricsGraph } from "../../views/Dashboard/components/DashboardActions";
import moment from "moment";

export const ProgramEnrollmentsChart = (props) => {
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
      let chartData = {};
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      for (let index = 0; index < 6; index++) {
        chartData[moment(startDate).format('YYYY-MM')] = {
          'month_formatted': moment(startDate).format('MMM yy'),
          'count': 0,
        };
        startDate.setMonth(startDate.getMonth() + 1);
      }

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      // filter out data older than 6 months ago
      let registrationDataArray = (data.data.data.programEnrollmentsConnection.groupBy.registration_date).filter(({key}) => (new Date(key)) > sixMonthsAgo);

      // set key = date and value = count
      let registrationData = {};
      registrationDataArray.map(item => {
        registrationData[item.key] = item.connection.aggregate.count;
      });

      Object.keys(registrationData).sort().forEach(date => {
        let yearMonth = moment(date).format('YYYY-MM');
        chartData[yearMonth]['count'] += registrationData[date];
      });

      setOptions({
        xaxis: {
          categories: Object.values(chartData).map(data => data.month_formatted),
        }
      });

      setSeries([
        {
          name: "Registrations",
          data: Object.values(chartData).map(data => data.count)
        },
        {
          name: "Certifications",
          data: ["2", "4", "5", "2", "3", "4"]
        }
      ]);
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

export const EmploymentConnectionsChart = (props) => {
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
      name: "Internships",
      data: []
    },
    {
      name: "Placements",
      data: []
    }
  ]);

  useEffect(() => {
    getMyDataMetricsGraph(userId, 'internships').then(data => {
      let chartData = {};
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      for (let index = 0; index < 6; index++) {
        chartData[moment(startDate).format('YYYY-MM')] = {
          'month_formatted': moment(startDate).format('MMM yy'),
          'count': 0,
        };
        startDate.setMonth(startDate.getMonth() + 1);
      }

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      // filter out data older than 6 months ago
      let internshipDataArray = (data.data.data.employmentConnectionsConnection.groupBy.start_date).filter(({key}) => (new Date(key)) > sixMonthsAgo);

      // set key = date and value = count
      let internshipData = {};
      internshipDataArray.map(item => {
        internshipData[item.key] = item.connection.aggregate.count;
      });

      Object.keys(internshipData).sort().forEach(date => {
        let yearMonth = moment(date).format('YYYY-MM');
        chartData[yearMonth]['count'] += internshipData[date];
      });

      setOptions({
        xaxis: {
          categories: Object.values(chartData).map(data => data.month_formatted),
        }
      });

      setSeries([
        {
          name: "Internships",
          data: Object.values(chartData).map(data => data.count)
        },
        {
          name: "Placements",
          data: ["2", "4", "5", "2", "3", "4"]
        }
      ]);
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
