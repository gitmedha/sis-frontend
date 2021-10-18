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

export const EmploymentConnectionsChart = (props) => {
    const userId = Number(localStorage.getItem("user_id")) || 2;
    const [options, setOptions] = useState({
      chart: {
        height: 280,
        type: "bar",
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
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        let internshipDataArray = (data.data.data.employmentConnectionsConnection.groupBy.start_date).filter(({key}) => (new Date(key)) > sixMonthsAgo);

        // set key = date and value = count
        let internshipData = {};
        internshipDataArray.map(item => {
          internshipData[item.key] = item.connection.aggregate.count;
        });
        // sort the data by date
        // internshipData = Object.keys(internshipData).sort().reduce((obj, key) => {
        //   obj[key] = internshipData[key];
        //   return obj;
        // }, {});

        let aggregateDate = [];
        Object.keys(internshipData).sort().forEach(date => {
          let internshipCount = internshipData[date];
          let yearMonth = moment(date).format('yy-MMM');

          if (aggregateDate[yearMonth] === undefined) {
            aggregateDate[yearMonth] = internshipCount;
          } else {
            aggregateDate[yearMonth] += internshipCount;
          }

          setOptions({
            xaxis: {
              categories: Object.keys(aggregateDate)
            }
          })

          setSeries([
            {
              name: "Internships",
              data: Object.values(aggregateDate)
            },
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
