
import React, { useEffect, useState, useRef } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const Dropdown = ({ data, selected, setSelected, setOpen, searchTerm, expandedItems, toggleExpand }) => {
  const filterData = (data, searchTerm) => {
    return data
      .map((item) => {
        const isMatch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredChildren = item.children ? filterData(item.children, searchTerm) : [];

        if (isMatch) {
          return { ...item, children: item.children || [] }; // Include all children
        }

        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      })
      .filter((item) => item !== null);
  };

  const filteredData = searchTerm ? filterData(data, searchTerm) : data;

  return (
    <div>
      {filteredData.map((item) => (
        <DropdownItem
          selected={selected}
          setSelected={setSelected}
          key={item.label}
          item={item}
          setOpen={setOpen}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
};

const DropdownItem = ({ item, selected, setSelected, setOpen, expandedItems, toggleExpand }) => {
  const isOpen = expandedItems[item.label] || false;

  const handleSelect = (e) => {
    e.stopPropagation();
    if (!item.children?.length) {
      setSelected(item);
      setOpen(false); // Close dropdown only for items without children
    } else {
      toggleExpand(item.label);
    }
  };

  return (
    <div className="dropdown-item">
      <div
        className={`dropdown-label ${selected?.value === item?.value ? "selectItem" : ""} ${item.children?.length ? "has-children" : ""}`}
        onClick={handleSelect}
      >
        {item.label}
        {item.children?.length > 0 && (
          <span className={`arrow ${isOpen ? "open" : ""}`}>
            {isOpen ? <FaAngleDown /> : <FaAngleRight />}
          </span>
        )}
      </div>
      {isOpen && item.children?.length > 0 && (
        <div className="dropdown-children">
          {item.children.map((child) => (
            <DropdownItem
              selected={selected}
              setSelected={setSelected}
              key={child.label}
              item={child}
              setOpen={setOpen}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NestedDropdown = ({ data, onChange, error, defaultValue }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded items
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelected({ value: defaultValue, label: defaultValue });
    setSearchTerm(defaultValue || "");
  }, [defaultValue]);

  const handleChange = (val) => {
    setSelected(val);
    setSearchTerm(val.label);
    onChange(val.value);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value === "") {
      setSelected({});
      onChange(""); // Notify parent of clear
    }
    setOpen(true); // Always open the dropdown when typing or backspacing
  };

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label], // Toggle the expanded state
    }));
  };

  return (
    <div className="form-group" style={{ width: "100%" }} ref={dropdownRef}>
      <div
        className="d-flex"
        style={{
          width: "100%",
          border: "1px solid #dee2e6",
          minHeight: "38px",
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <input
          type="text"
          value={searchTerm}
          onInput={handleInput} // Open the dropdown and filter results when typing
          placeholder="Select Industry"
          style={{
            flex: 1,
            padding: "2px 9px",
            border: "none",
            outline: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        />
        <div
          style={{
            marginLeft: "auto",
            marginRight: "2%",
            color: "hsl(0, 0%, 80%)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "0.5rem", color: "hsl(0, 0%, 80%)" }}>
            {" "}
            |{" "}
          </span>
          <FaAngleDown
            className="fa-solid fa-chevron-down"
            style={{
              fontSize: "14px",
              color: "hsl(0, 0%, 80%)",
            }}
          />
        </div>
      </div>
      {open && (
        <div
          style={{
            border: "1px solid #dee2e6",
            // padding: "5px",
            marginTop: "5px",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Dropdown
            setOpen={setOpen}
            selected={selected}
            setSelected={handleChange}
            data={data}
            searchTerm={searchTerm}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
        </div>
      )}
      {error && <div className="text-danger error--text mt-2">{error}</div>}
    </div>
  );
};

export default NestedDropdown;
