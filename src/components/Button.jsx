import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Forms from "./Forms";

const Buttons = ({ label, onClick, disabled, style }) => {
  return (
    <button
      className="shop_now body-font"
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {label}
    </button>
  );
};

const DoButton = ({
  value = 0,
  onChange,
  min = 0,
  max = Infinity,
  disabled = false,
  inputProps = {},
}) => {
  const updateValue = (newVal) => {
    if (disabled) return;
    const num = Number(newVal);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    }
  };

  return (
    <div className="do-button d-flex align-items-center">
      {/* Minus */}
      <button
        className="mx-2 dos mb-4"
        onClick={() => updateValue(value - 1)}
        disabled={disabled || value <= min}
        type="button"
      >
        <FaMinus />
      </button>

      {/* Input Field */}
      <div className="w-25">
        <Forms
          type="text"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "") onChange("");
            else updateValue(val);
          }}
          readOnly={disabled}
          className="text-center"
          {...inputProps}
        />
      </div>

      {/* Plus */}
      <button
        className="mx-2 dos mb-4"
        onClick={() => updateValue(value + 1)}
        disabled={disabled || value >= max}
        type="button"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export { Buttons, DoButton };