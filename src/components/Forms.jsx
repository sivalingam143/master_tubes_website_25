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
       <select 
        className="form-select" 
        value={value} 
        onChange={onChange} // This MUST be here
        isMulti={isMulti}
          placeholder={PlaceHolder}
          classNamePrefix="react-select"
      >
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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
