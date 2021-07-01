import Chart from "react-apexcharts";

const BarChart = (props) => {
  const options = {
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
    chart: {
      width: "100%",
      height: 380,
      id: props.id,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      colors: ["#AA223C", "#207B69"],
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
    {
      name: "series-2",
      data: [35, 35, 40, 25, 44, 55, 75, 102],
    },
  ];

  return <Chart options={options} type={props.type} series={series} />;
};

export default BarChart;
