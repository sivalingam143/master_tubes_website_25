import Form from "react-bootstrap/Form";

function Forms({
  FormLabel,
  PlaceHolder,
  type = "text",
  options = [],
  value,
  onChange,
  isMulti = false,
  readOnly = false,
  maxLength,
}) {
  return (
    <Form.Group className="mb-3">
      {FormLabel && <Form.Label>{FormLabel}</Form.Label>}

      {/* ===== NATIVE SELECT DROPDOWN ===== */}
      {type === "select" ? (
        <select
          className="form-select"
          value={value}
          onChange={onChange}
          disabled={readOnly}
          style={{ cursor: readOnly ? "not-allowed" : "default" }}
        >
          <option value="">{PlaceHolder}</option>
          {options.map((opt, index) => (
            <option key={index} value={opt.value}>
              {opt.label}
            </option>
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
