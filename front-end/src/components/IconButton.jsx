import React from "react";
import { memo } from "react";
import styled from "styled-components";

const IconButton = styled.button`
  padding: 0;
  border: none;
  background: none;

  :hover {
    border: black thin solid;
  }

  :active {
    background-color: white;
  }
`;

export default memo(IconButton);
