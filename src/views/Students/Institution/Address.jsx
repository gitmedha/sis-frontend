const Address = ({
  address_line,
  medha_area,
  pin_code,
  state,
}) => {
  return (
    <div className="container-fluid my-3">
      <div className="row latto-regular">
        <div className="col-md-4">
          <p className="text-heading">Address</p>
          <p className="latto-regular">{address_line}</p>
        </div>
        <div className="col-md-4">
          <p className="text-heading">Area</p>
          <p className="latto-regular">{medha_area}</p>
        </div>
        <div className="col-md-4">
          <p className="text-heading">Pin Code</p>
          <p className="latto-regular">{pin_code}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <p className="text-heading">State</p>
          <p className="latto-regular">{state}</p>
        </div>
      </div>
    </div>
  );
};

export default Address;
