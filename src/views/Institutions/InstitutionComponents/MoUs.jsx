import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";

const MoUs = ({ mou_list }) => {
  mou_list = mou_list.map((mou) => {
    mou.mou.url = <Anchor text={mou.mou.url} href={mou.mou.url} />;
    return mou;
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'mou.url',
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
