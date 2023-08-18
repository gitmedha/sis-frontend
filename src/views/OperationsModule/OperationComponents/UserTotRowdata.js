import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Skeleton from "react-loading-skeleton";
import { getStateDistricts } from "../../Address/addressActions";
import {
  getAllSrm,
  getDefaultAssigneeOptions,
} from "../../../utils/function/lookupOptions";

const UserTotRowdata = (props) => {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "",
      institution: "",
      batch: "",
      state: "",
      start_date: "",
      end_date: "",
      topic: "",
      donor: "",
      guest: "",
      designation: "",
      organization: "",
      activity_type: "",
      assigned_to: "",
    },
    // Add more initial rows as needed
  ]);
  const [row, setRowData] = useState(props.row);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [areaOptions, setAreaOptions] = useState([]);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [srmOption,setsrmOption]=useState([])
  const handleChange = (options, key) => {
    console.log(options, key);
  };
  const onStateChange = (value, rowid, field) => {
    getStateDistricts(value).then((data) => {
      setAreaOptions([]);
      setAreaOptions(
        data?.data?.data?.geographiesConnection.groupBy.area
          .map((area) => ({
            key: area.id,
            label: area.key,
            value: area.key,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    });
    props.updateRow(rowid, field, value.value);
  };
  useEffect(async () => {
    let data = await getAllSrm(1);
    setsrmOption(data)
    // console.log("SRM ", data);
  }, []);

  useEffect(() => {
    getDefaultAssigneeOptions().then((data) => {
      setAssigneeOptions(data);
    });
    // console.log("assigneeOptions ; \n ",assigneeOptions);
  }, []);

  const updateRow = (id, field, value) => {
    row[field] = value;
    console.log(id, field, value);
    // props.handleInputChange()
    // setRows(updatedRows);
  };

  return (
    <>
      <tr key={row.id}>
        <td>{row.id}</td>
        <td>
          <input
            className="table-input"
            type="text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "user_name", e.target.value)}
          />
        </td>
        <td>
         
          {/* <input
            className="table-input"
            type="number"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "trainer_1", e.target.value)}
          /> */}
          <Select
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="tariner_1"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "trainer_1", row.id)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="Text"
            // value={row.name}
            onChange={(e) => updateRow(row.id, "project_name", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="Text"
            // value={row.name}
            onChange={(e) =>
              updateRow(row.id, "certificate_given", e.target.value)
            }
          />
          {/* <Select
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="assigned_to"
            options={assigneeOptions}
            onChange={(e) => props.handleChange(e, "assigned_to", row.id)}
          /> */}
        </td>
        <td>
          <Select
            className="basic-single table-input"
            classNamePrefix="select"
            // defaultValue={stateOptions[0]}
            // isDisabled={isDisabled}
            // isLoading={true}
            isClearable={true}
            // isRtl={isRtl}
            isSearchable={true}
            name="state"
            options={props.statedata}
            onChange={(e) => onStateChange(e, row.id, "state")}
          />
        </td>
        <td>
          {areaOptions.length ? (
            <Select
              className="basic-single table-input"
              classNamePrefix="select"
              // defaultValue={batchOptions[0]}
              // isDisabled={isDisabled}
              // isLoading={true}
              isClearable={true}
              // isRtl={isRtl}
              isSearchable={true}
              name="area"
              options={areaOptions}
              onChange={(e) => props.handleChange(e, "area", row.id)}
            />
          ) : (
            <>
              {/* <label className="text-heading" style={{ color: '#787B96' }}>Please select State to view Medha Areas</label> */}
              <Skeleton count={1} height={45} />
            </>
          )}
        </td>
        <td>
          {/* <DatePicker
                        dateFormat="dd/MM/yyyy"
                        className="table-input"
                        selected={startDate}
                        onChange={(date) => {
                            const d = new Date(date).toLocaleDateString('fr-FR');
                            setStartDate(date)

                            props.updateRow(row.id, 'start_date', d)
                        }}
                    /> */}
          <input
            type="date"
            className="table-input date"
            defaultValue={startDate}
            onChange={(e) => {
              console.log(e.target.value);

              setStartDate(e.target.value);
              props.updateRow(row.id, "start_date", e.target.value);
            }}
          />
        </td>
        <td>
          {/* <DatePicker
                        // dateFormat="dd/MM/yyyy"
                        // className="table-" 
                        selected={endDate}
                        showYearPicker
                        showMonthYearPicker
                        onChange={(date) => {
                            const d = new Date(date).toLocaleDateString('fr-FR');
                            setEndDate(date)
                            props.updateRow(row.id, 'end_date', d)}} 

                      
                    /> */}
          <input
            type="date"
            className="table-input date"
            value={endDate}
            onChange={(event) => {
              const date = event.target.value;
              setEndDate(date);
              props.updateRow(row.id, "end_date", date);
            }}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "module_name", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) => props.updateRow(row.id, "project_type", true)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "new_entry", e.target.value)
            }
          />
        </td>
        <td>
          {/* <input
            className="table-input"
            type="number"
            onChange={(e) => updateRow(row.id, "trainer_2", e.target.value)}
          /> */}
           <Select
            className="basic-single table-input"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="trainer_2"
            options={srmOption}
            onChange={(e) => props.handleChange(e, "trainer_2", row.id)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "partner_dept", e.target.value)
            }
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) => props.updateRow(row.id, "college", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) => props.updateRow(row.id, "age", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) => props.updateRow(row.id, "gender", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) => props.updateRow(row.id, "contact", e.target.value)}
          />
        </td>
        <td>
          <input
            className="table-input"
            type="text"
            onChange={(e) =>
              props.updateRow(row.id, "designation", e.target.value)
            }
          />
        </td>

        {/* <td>
                <button onClick={() => setRowid(row.id)}>Delete Row</button>
              </td> */}
      </tr>
    </>
  );
};

export default UserTotRowdata;
