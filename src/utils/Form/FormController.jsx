import Input from "./Input";
import Radio from "./Radio";
import Select from "./Select";
import Textarea from "./Textarea";
import PropTypes from "prop-types";
import DatePicker from "./DatePicker";
import SelectLookup from "./SelectLookup";
import CheckboxGroup from "./CheckboxGroup";

const FormController = (props) => {
  const { control, ...rest } = props;

  switch (control) {
    case "input":
      return <Input {...rest} />;
    case "textarea":
      return <Textarea {...rest} />;
    case "select":
      return <Select {...rest} />;
    case "radio":
      return <Radio {...rest} />;
    case "checkbox":
      return <CheckboxGroup {...rest} />;
    case "datepicker":
      return <DatePicker {...rest} />;
    case "lookup":
      return <SelectLookup {...rest} />;
    default:
      return null;
  }
};

FormController.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.string.isRequired,
};

export default FormController;
