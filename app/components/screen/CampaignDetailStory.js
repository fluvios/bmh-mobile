import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Body, Text } from 'native-base';
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper';

export default class CampaignDetailStory extends Component {

    constructor(props) {
    super(props);
  }

  render() {
    const campaign = this.props.data.campaign;

    return (
      <Content>
        <Card>
          <CardItem>
            <Body>
              <Text>{cleanTag(campaign.description)}</Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}