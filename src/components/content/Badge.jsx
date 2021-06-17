const Badge = ({ type, text }) => (
  <div className={`badge badge-${type} text-capitalize text-center`}>
    {text}
  </div>
);

export default Badge;
