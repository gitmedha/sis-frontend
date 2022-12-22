import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";

const MoUs = ({ mou_list }) => {
  mou_list = mou_list.map((mou) => {
    mou.id = <Anchor text = {mou.id} href = {mou.id} />;
    return mou;
  });

  const columns = useMemo(
    () => [
      {
        Header: 'URL',
        accessor: 'mou',
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
      },
    ],
    []
  );

  return (
    <div className="container-fluid my-3">
      <Table
        columns={columns}
        data={mou_list}
        paginationPageSize={mou_list.length}
        totalRecords={mou_list.length}
        fetchData={() => {}}
        loading={false}
        showPagination={false}
      />
    </div>
  );
};

export default MoUs;
