import React, { Component } from 'react';
import {
  Container, Header, Title, Button, Icon, Tabs, Tab,
  Left, Body, Right, Content, Footer, FooterTab, Text
} from 'native-base';
import NewsListBerita from "./NewsListBerita";
import NewsListInspirasi from "./NewsListInspirasi";
import NewsListKonsultasi from "./NewsListKonsultasi";
import NewsListMagazine from "./NewsListMagazine";

export default class NewsList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const propies = this.props;
    return (
      <Container>
          <Content>
              <Tabs >
                  <Tab heading="News" textStyle={{ fontSize: 11 }} activeTextStyle={{ fontSize: 11 }}>
                      <NewsListBerita data={{propies}} />
                  </Tab>
                  <Tab heading="Inspiration" textStyle={{ fontSize: 11 }} activeTextStyle={{ fontSize: 11 }}>
                      <NewsListInspirasi data={{propies}} />
                  </Tab>
                  <Tab heading="Consultation" textStyle={{ fontSize: 11 }} activeTextStyle={{ fontSize: 11 }}>
                      <NewsListKonsultasi data={{propies}} />
                  </Tab>
                  <Tab heading="I-Magazine" textStyle={{ fontSize: 11 }} activeTextStyle={{ fontSize: 11 }}>
                      <NewsListMagazine data={{propies}} />
                  </Tab>
              </Tabs>
          </Content>
      </Container>
  );
  }
}