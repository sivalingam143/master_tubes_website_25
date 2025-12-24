import React from "react";
import { FaPlus ,FaMinus  } from "react-icons/fa";
import Forms from "./Forms";
const Buttons = ({label, onClick}) => {
  return <>
    <button className="shop_now body-font" onClick={onClick}>{label}</button>
  </>;
};
const DoButton = ({ onClick }) => {
  return (
    <>
      <div className="do-button">
        <button className="mx-2 dos" onClick={onClick}>
          <FaMinus />
        </button>
        <div className="w-25">
          {" "}
          <Forms PlaceHolder="No" />
        </div>
        <button className="mx-2 dos" onClick={onClick}>
          <FaPlus />
        </button>
      </div>
    </>
  );
};

export { Buttons, DoButton };
