import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const NestedDropdown = ({ data,defaultValue,onChange, error }) => {
    const [selected, setSelected] = useState(defaultValue || null);

  const renderDropdownItems = (items) => {
    return items.map((item) => {
      // Handler for item selection
      const handleSelect = (value) => {
        console.log('Selected:', value); // Console the selected value
        setSelected(value); // Update local state
        onChange(value); // Update Formik state
      };

      return (
        <Dropdown key={item.value} className='form-group' style={{ width: '100%' }}>
          {/* Only show dropdown if the item has children */}
          {item.children.length > 0 ? (
            <>
              <Dropdown.Toggle as="a" href="#">
                {item.label}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {renderDropdownItems(item.children)}
              </Dropdown.Menu>
            </>
          ) : (
            // If no children, just show the item as a clickable item
            <Dropdown.Item
              onClick={() => handleSelect(item.value)}
              style={{ color: 'black' }} // Set the color of dropdown items to black
            >
              {item.label}
            </Dropdown.Item>
          )}
        </Dropdown>
      );
    });
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle
          variant="none"
          style={{
            border: '1px solid hsl(0, 0%, 80%)',
            width: '100%',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          id="dropdown-basic"
          className="form-group"
        >
          {selected ? ` ${selected}` : 'Select an option'}
          <div className="d-flex" style={{ marginLeft: 'auto', color: 'hsl(0, 0%, 80%)' }}>
            <span style={{ color: 'hsl(0, 0%, 80%)' }}> | </span>
            <i
              className="fa-solid fa-chevron-down"
              style={{
                marginTop: '0.5rem',
                marginLeft: '0.2rem',
                fontSize: '10px',
                color: 'hsl(0, 0%, 80%)',
              }}
            ></i>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className='w-100'>{renderDropdownItems(data)}</Dropdown.Menu>
        {error && <div className="text-danger error--text mt-2">{error}</div>}
      </Dropdown>
    </div>
  );
};

export default NestedDropdown;
