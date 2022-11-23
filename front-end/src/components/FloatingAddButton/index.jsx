import React from "react";
import { memo } from "react";
import { PositioningSlide, AddButton } from "./styles";

function FloatingAddButton() {
  return (
    <PositioningSlide>
      <AddButton>+</AddButton>
    </PositioningSlide>
  );
}

export default memo(FloatingAddButton);
