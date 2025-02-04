import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";



const Dropdown = ({ data, selected, setSelected, setOpen }) => {
  return (
    <div className="dropdown-select "  >
      {data.map((item) => (
        <DropdownItem selected={selected} setSelected={setSelected} key={item.label} item={item} />
      ))}
    </div>
  );
};

const DropdownItem = ({ item, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-item">
      <div
        className={`dropdown-label ${(selected?.value && selected?.value === item?.value) ? 'selectItem' : ''} ${item.children.length ? "has-children" : ""}`}
        onClick={() => {
          setIsOpen((prev) => !prev)
          if (item.children.length === 0) {
            setSelected(item)
          } if (selected?.value && selected?.value === item?.value) {
            setSelected({})
          }
        }}
      >
        {item.label}
        {item.children.length > 0 && (
          <span style={{ color: 'hsl(0, 0%, 80%)' }} className={`arrow ${isOpen ? "open" : ""}`}>
            <FaAngleRight />
          </span>
        )}
      </div>
      {isOpen && item.children.length > 0 && (
        <div className="dropdown-children">
          {item.children.map((child) => (
            <DropdownItem
              selected={selected} setSelected={setSelected}
              key={child.label} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

// export default Dropdown;

const NestedDropdown = ({ data,onChange,error,defaultValue }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState({})
  // const dropdownRef = useRef(null); // Create a ref for the dropdown container
  
  useEffect(() => {
      if(selected?.value){
        setOpen(false)
      }
  }, [selected?.value]);

  useEffect(()=>{
    setSelected({value:defaultValue,label:defaultValue})
  },[defaultValue])

  const handleChange=(val)=>{
    setSelected(val)
    onChange(val.value)
  }

  return <div className="form-group" style={{ width: '100%'}}>
    <div className="d-flex " style={{ width: "100%" ,background:"none",border:"1px solid #dee2e6",minHeight:"38px" }} onClick={() => setOpen(!open)}>
      <span style={{ marginTop: '0.3rem',position:'relative',left:"2%" }}>{selected?.label ||  <span style={{ marginTop: '0.3rem',marginRight:"", color: 'hsl(0, 0%, 80%)' }}>{'Select Industry'}</span> }</span>
      <div className="d-flex" style={{ marginLeft: 'auto',marginRight:"2%", color: 'hsl(0, 0%, 80%)' }}>
            <span style={{ marginTop: '0.3rem', color: 'hsl(0, 0%, 80%)' }}> | </span>
            <FaAngleDown
              className="fa-solid fa-chevron-down"
              style={{
                marginTop: '0.6rem',
                marginLeft: '0.2rem',
                fontSize: '14px',
                color: 'hsl(0, 0%, 80%)',
              }}
            />
      </div>
    </div>
    
    {open && <div >
      <Dropdown
        setOpen={setOpen}
        selected={selected}
        setSelected={(val)=>handleChange(val)} data={data} />
    </div>}
    {error && <div className="text-danger error--text mt-2">{error}</div>}
  </div>
}


export default NestedDropdown;