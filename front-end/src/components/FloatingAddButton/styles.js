import styled from "styled-components";

export const PositioningSlide = styled.div`
  width: inherit;
  bottom: 20px;
  position: fixed;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const AddButton = styled.button`
  position: absolute;
  background-color: #f4aaaa;
  right: 25px;
  bottom: 20px;
  font-size: 70px;
  padding: 0.2em;
  clip-path: circle();
  border: unset;

  :hover {
    background-color: #e98282;
  }
  :active {
    background-color: #f4aaaa;
  }
`;
