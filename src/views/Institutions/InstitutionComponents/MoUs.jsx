import Table from "../../../components/content/Table";

const MoUs = ({ mou }) => {
  mou = mou.map((mou_obj) => {
    if (mou_obj.mou_file.hasOwnProperty("url")) {
      let url = mou_obj.mou_file.url;
      if (typeof url === "string") {
        let file_name = url.split("/").pop();
        mou_obj.mou_file.url = (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {file_name}
          </a>
        );
      }
    } else {
      mou_obj.mou_file.url = "No Data Found";
    }
    mou_obj.start_date = new Date(mou_obj.start_date).toLocaleDateString();
    mou_obj.end_date = new Date(mou_obj.end_date).toLocaleDateString();
    return mou_obj;
  });
  const columns = [
    { Header: "Name", accessor: "mou_file.url" },
    { Header: "Start Date", accessor: "start_date" },
    { Header: "End Date", accessor: "end_date" },
  ];
  return (
    <div className="container-fluid my-3">
      <Table
        columns={columns}
        data={mou}
        paginationPageSize={mou.length}
        totalRecords={mou.length}
        fetchData={() => {}}
        loading={false}
        showPagination={false}
      />
    </div>
  );
};

export default MoUs;
