import styled from "styled-components";

export const CardBody = styled.div`
  text-align: left;
  padding: 16px;
  margin: 24px;
  background-color: #ffd3d0;
  border: red thick dotted;
`;

export const TitleBox = styled.span`
  display: flex;
  justify-content: space-between;
`;

export const DishTitle = styled.h2`
  margin: 0;
  display: inline;
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

export const EditButton = styled.button`
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
