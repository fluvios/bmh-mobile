import React, { Component } from 'react'
import { Image } from 'react-native'
import { Container, Header, Content, Card, CardItem, Body, Text } from 'native-base'
import { baseUrl } from "../config/variable"

export default class CampaignDetailStory extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const campaign = this.props.data.campaign.update
    console.log(campaign)
    return (
      <Content>
        {
          campaign.map((c) =>
            <Card key={c.id}>
              <CardItem header>
                <Text>#update {c.id} ({c.date})</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Image source={{ uri: baseUrl + "public/campaigns/updates/" + c.image }} style={{ height: 200, width: "100%", flex: 1 }} />
                  <Text>{c.description}</Text>
                </Body>
              </CardItem>
            </Card>
          )
        }
      </Content>
    )
  }
}