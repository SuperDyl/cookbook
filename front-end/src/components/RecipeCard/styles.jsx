import styled from "styled-components";

export const CardBody = styled.div`
  text-align: left;
  padding: 16px;
  margin: 24px;
  background-color: #ffd3d0;
  border: red thick dotted;
`;

export const DishTitle = styled.h2`
  text-align: center;
  margin: 0;
`;

export const IngredientList = styled.ul`
  padding-left: 0;
  margin-left: 20px;
  list-style-type: circle;
`;

export const IngredientItem = styled.li`font-style: italic;`;

export const StepsList = styled.ol`
  padding-left: 0;
  margin-left: 24px;
`;

export const NotesText = styled.p`font-weight: bold;`;
