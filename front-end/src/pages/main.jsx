import React from "react";
import { memo } from "react";
import {
  FullWindow,
  Header,
  Footer,
  MainContent,
  Text,
  ReadingPane,
  LabelBar
} from "./main-styles";

function MainPage() {
  return (
    <FullWindow>
      <Header>Header</Header>
      <LabelBar>LabelBar</LabelBar>
      <MainContent>
        <ReadingPane>
          <Text>testing</Text>
        </ReadingPane>
      </MainContent>
      <Footer>Footer </Footer>
    </FullWindow>
  );
}

export default memo(MainPage);
