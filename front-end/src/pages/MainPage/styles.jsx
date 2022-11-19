import styled from "styled-components";

export const FullWindow = styled.div`
  overflow: auto;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  ont-size: 40px;
  background-color: unset;
  border-bottom: red double thick;
`;

export const LabelBar = styled.div`background-color: pink;`;

export const Footer = styled.div`background-color: yellow;`;

export const MainContent = styled.div`
  background-color: orange;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 900px) {
    align-items: center;
  }
`;

export const ReadingPane = styled.div`
  background-color: green;
  flex-grow: 1;

  @media (min-width: 900px) {
    width: 850px;
  }
`;

export const Text = styled.p`
  padding-top: 16px;
  padding-bottom: 16px;
  margin: 0;
`;
