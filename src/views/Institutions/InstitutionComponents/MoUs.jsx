import { useMemo } from "react";
import Table from "../../../components/content/Table";
import { Anchor } from "../../../components/content/Utils";

const MoUs = ({ mou }) => {
  mou = mou.map((mou_file) => {
    mou_file.mou_file.url = <Anchor text={mou_file.mou_file.url} href={mou_file.mou_file.url} />;
    return mou_file;
  });

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'mou_file.url',
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
