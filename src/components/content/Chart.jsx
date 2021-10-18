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
  const [series, setSeries] = useState([]);

  useEffect(async () => {
    let chartData = {};
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    for (let index = 0; index < 6; index++) {
      chartData[moment(startDate).format('YYYY-MM')] = {
        'month_formatted': moment(startDate).format('MMM yy'),
        'count': 0,
      };
      startDate.setMonth(startDate.getMonth() + 1);
    }
    let registrationChartData = JSON.parse(JSON.stringify(chartData));
    let certificationChartData = JSON.parse(JSON.stringify(chartData));

    setOptions({
      xaxis: {
        categories: Object.values(chartData).map(data => data.month_formatted),
      }
    });

    await getMyDataMetricsGraph(userId, 'registrations').then(data => {
      let sixMonthsAgo = new Date();
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
        registrationChartData[yearMonth]['count'] += registrationData[date];
      });
    });

    await getMyDataMetricsGraph(userId, 'certifications').then(data => {
      let sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      // filter out data older than 6 months ago
      let certificationDataArray = (data.data.data.programEnrollmentsConnection.groupBy.certification_date).filter(({key}) => (new Date(key)) > sixMonthsAgo);

      // set key = date and value = count
      let certificationData = {};
      certificationDataArray.map(item => {
        certificationData[item.key] = item.connection.aggregate.count;
      });

      Object.keys(certificationData).sort().forEach(date => {
        let yearMonth = moment(date).format('YYYY-MM');
        certificationChartData[yearMonth]['count'] += certificationData[date];
      });
    });

    if (registrationChartData && certificationChartData) {
      setSeries([
        {
          name: "Registrations",
          data: Object.values(registrationChartData).map(data => data.count)
        },
        {
          name: "Certifications",
          data: Object.values(certificationChartData).map(data => data.count)
        },
      ]);
    }
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

  useEffect(async () => {
    let chartData = {};
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5);
    for (let index = 0; index < 6; index++) {
      chartData[moment(startDate).format('YYYY-MM')] = {
        'month_formatted': moment(startDate).format('MMM yy'),
        'count': 0,
      };
      startDate.setMonth(startDate.getMonth() + 1);
    }
    let internshipChartData = JSON.parse(JSON.stringify(chartData));
    let placementChartData = JSON.parse(JSON.stringify(chartData));

    setOptions({
      xaxis: {
        categories: Object.values(chartData).map(data => data.month_formatted),
      }
    });

    await getMyDataMetricsGraph(userId, 'internships').then(data => {
      let sixMonthsAgo = new Date();
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
        internshipChartData[yearMonth]['count'] += internshipData[date];
      });
    });

    await getMyDataMetricsGraph(userId, 'placements').then(data => {
      let sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      // filter out data older than 6 months ago
      let placementDataArray = (data.data.data.employmentConnectionsConnection.groupBy.start_date).filter(({key}) => (new Date(key)) > sixMonthsAgo);

      // set key = date and value = count
      let placementData = {};
      placementDataArray.map(item => {
        placementData[item.key] = item.connection.aggregate.count;
      });

      Object.keys(placementData).sort().forEach(date => {
        let yearMonth = moment(date).format('YYYY-MM');
        placementChartData[yearMonth]['count'] += placementData[date];
      });
    });

    if (internshipChartData && placementChartData) {
      setSeries([
        {
          name: "Internships",
          data: Object.values(internshipChartData).map(data => data.count)
        },
        {
          name: "Placements",
          data: Object.values(placementChartData).map(data => data.count)
        },
      ]);
    }
  }, []);

  return (
    <Chart
      options={options}
      series={series}
      type="area"
    />
  )
};
