import styled from "styled-components";
import IconButton from "../../components/IconButton";

export const FullWindow = styled.div`
  overflow: auto;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  font-size: 40px;
  background-color: unset;
  border-bottom: red double thick;
`;

export const LabelBar = styled.div`background-color: pink;`;

export const Footer = styled.div`
  background-color: #9f2828;
  padding: 12px;
  text-align: right;
  color: white;
`;

export const MainContent = styled.div`
  background-color: #da9696;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 900px) {
    align-items: center;
  }
`;

export const ReadingPane = styled.div`
  position: relative;
  background-color: white;
  flex-grow: 1;

  @media (min-width: 900px) {
    width: 850px;
  }
`;

// export const Text = styled.p`
//   padding-top: 16px;
//   padding-bottom: 16px;
//   margin: 0;
// `;

export const Toolbar = styled.div`
  min-height: 50px;
  border: red thin;
  border-bottom-style: solid;
  border-top-style: solid;
  display: flex;
  justify-content: flex-end;
`;

export const StyledIconButton = styled(IconButton)`
  margin-right: 20px;
  padding: 10px;

  :active {
    background-color: #f5abaa;
  }
`;
