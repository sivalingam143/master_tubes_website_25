import Form from "react-bootstrap/Form";
import Select from "react-select";

function Forms({
  FormLabel,
  PlaceHolder,
  type = "text",
  options = [],
  value,
  onChange,
  isMulti = false,
}) {
  return (
    <Form.Group className="mb-3">
      {FormLabel && <Form.Label>{FormLabel}</Form.Label>}

      {/* ===== REACT-SELECT DROPDOWN ===== */}
      {type === "select" ? (
        <Select
          options={options}
          value={value}
          onChange={onChange}
          isMulti={isMulti}
          placeholder={PlaceHolder}
          classNamePrefix="react-select"
        />
      ) : (
        /* ===== NORMAL INPUT ===== */
        <Form.Control
          type={type}
          placeholder={PlaceHolder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      )}
    </Form.Group>
  );
}

export default Forms;
