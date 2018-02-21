import React, { Component } from 'react';
import { styles } from "../config/styles";
import {
  Container, Header, Left, Body, Right, Title,
  Content, Footer, FooterTab, Button, Text, Card,
  CardItem, Thumbnail, Spinner,
} from 'native-base';
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper';
import * as Progress from 'react-native-progress';
import { baseUrl } from "../config/variable";


export default class CampaignDetailText extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const campaign = this.props.data.campaign
    const percent = campaign.total/campaign.goal
    return (
      <Content>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: baseUrl+"public/avatar/default.jpg" }} />
              <Body>
                <Text>{campaign.title}</Text>
                <Text note>{campaign.date}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Body>
              <Text>
                Deadline: {campaign.deadline}
              </Text>
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Progress.Bar progress={percent} width={150} showsText={true} />
            </Left>
            <Body>
              <Text style={styles.textInfo}>Terkumpul: {campaign.total}/{campaign.goal}</Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}