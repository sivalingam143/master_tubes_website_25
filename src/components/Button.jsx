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
  value = 1,
  onChange,
  min = 1,
  max = Infinity,
  disabled = false,
}) => {
  const change = (input) => {
    if (disabled) return;

    // Allow empty input while typing
    if (input === "") {
      onChange("");
      return;
    }

    const num = Number(input);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <div className=" do-button d-flex align-items-center">
      <button
        className="mx-2 dos mb-4"
        onClick={() => change(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
      >
        <FaMinus />
      </button>

      <div className="w-25">
        <Forms
          type="text"
          value={value}
          onChange={(e) => change(e.target.value)}
          className="text-center"
          readOnly={disabled}
        />
      </div>

      <button
        className="mx-2 dos mb-4"
        onClick={() => change(value + 1)}
        disabled={disabled || value >= max}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export { Buttons, DoButton };