import React from "react";
import { memo, useRef } from "react";
import {
  CardBody,
  DishTitle,
  IngredientList,
  IngredientItem,
  StepsList,
  NotesText,
  TitleBox,
  CancelEditButton,
  SaveEditButton,
  EditButtonGroup,
  DeleteCardButton
} from "./styles";
import PencilIcon from "./pencil-icon.svg";

function getListItemText(someNode) {
  const listItemText = [];
  for (const item of someNode.children) {
    listItemText.push(item.innerText);
  }
  return listItemText;
}

function EditRecipeCard({
  toggleEdit = () => {},
  saveEdit,
  deleteRecipe = () => {},
  dishName = "",
  labels = [],
  desc = "",
  totalTime,
  ingredients = [],
  steps = [],
  notes = "",
  _id,
  ...rest
}) {
  const editedDishName = useRef(null);
  const editedDesc = useRef(null);
  const editedTotalTime = useRef(null);
  const editedIngredients = useRef(null);
  const editedSteps = useRef(null);
  const editedNotes = useRef(null);

  if (typeof saveEdit === "undefined") {
    saveEdit = toggleEdit;
  }

  function onSave() {
    const items = {
      _id,
      dishName: editedDishName.current.innerText,
      desc: editedDesc.current.innerText,
      totalTime: editedTotalTime.current.innerText,
      ingredients: getListItemText(editedIngredients.current),
      steps: getListItemText(editedSteps.current),
      notes: editedNotes.current.innerText
    };
    saveEdit(items);
  }

  return (
    <CardBody>
      <TitleBox>
        <span>
          <DishTitle>
            {`Edit: `}
          </DishTitle>
          <DishTitle ref={editedDishName} contentEditable>
            {dishName}
          </DishTitle>
        </span>
      </TitleBox>
      {/* <p>{`Labels: ${labels.reduce(
        (curr, prev) => curr + ", " + prev,
        ""
      )}`}</p> */}
      <p ref={editedDesc} contentEditable>
        {desc}
      </p>
      <p ref={editedTotalTime} contentEditable>
        {totalTime}
      </p>
      <IngredientList ref={editedIngredients} contentEditable>
        {ingredients.map(ingredient =>
          <IngredientItem key={`ingredient-${ingredient}`}>
            {ingredient}
          </IngredientItem>
        )}
      </IngredientList>
      <StepsList ref={editedSteps} contentEditable>
        {steps.map(step =>
          <li key={`step-${step}`}>
            {step}
          </li>
        )}
      </StepsList>
      <NotesText ref={editedNotes} contentEditable>
        {`${notes}`}
      </NotesText>
      <EditButtonGroup>
        <DeleteCardButton onClick={() => deleteRecipe(_id)}>
          Delete Card
        </DeleteCardButton>
        <CancelEditButton onClick={toggleEdit}>Cancel Edit</CancelEditButton>
        <SaveEditButton onClick={onSave}>Save Edit</SaveEditButton>
      </EditButtonGroup>
    </CardBody>
  );
}

export default memo(EditRecipeCard);
