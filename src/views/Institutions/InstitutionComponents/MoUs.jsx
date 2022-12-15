import { useMemo } from "react";
import Table from "../../../components/content/Table";

const MoUs = ({ mou }) => {
  mou = mou.map((Mou) => {
    return Mou;
  });

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Mou",
        accessor: "url",
      },
    ],
    []
  );

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
