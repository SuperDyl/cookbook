import React from "react";
import { memo } from "react";
import { PositioningSlide, AddButton } from "./styles";

function FloatingAddButton({ onClick }) {
  return (
    <PositioningSlide>
      <AddButton onClick={onClick}>+</AddButton>
    </PositioningSlide>
  );
}

export default memo(FloatingAddButton);
