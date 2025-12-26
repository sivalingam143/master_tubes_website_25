import React from "react";
import { FaPlus ,FaMinus  } from "react-icons/fa";
import Forms from "./Forms";
const Buttons = ({label, onClick}) => {
  return <>
    <button className="shop_now body-font" onClick={onClick}>{label}</button>
  </>;
};
const DoButton = ({ value, onAdd, onSubtract }) => {
  return (
    <>
      <div className="do-button d-flex align-items-center">
        {/* Minus Button */}
        <button className="mx-2 dos mb-4" onClick={onSubtract} type="button">
          <FaMinus />
        </button>

        {/* Displaying the quantity value */}
        <div className="w-25">
          <Forms 
            type="text" 
            readOnly 
            value={value} 
            className="text-center" 
          />
        </div>

        {/* Plus Button */}
        <button className="mx-2 dos mb-4" onClick={onAdd} type="button">
          <FaPlus />
        </button>
      </div>
    </>
  );
};

export { Buttons, DoButton };
