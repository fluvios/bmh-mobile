import React, { Component } from 'react'
import { Image } from 'react-native'
import {
  Container, Header, Content, Card, CardItem,
  Body, Text, Left, Right, Button
} from 'native-base'
import { cleanTag, convertToSlug, shortenDescription, convertToRupiah } from '../config/helper'
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
                <Body>
                  <Text>{c.title}</Text>
                  <Text>{c.date}</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  {c.image != '' &&
                    <Image source={{ uri: baseUrl + "public/campaigns/updates/" + c.image }} style={{ height: 200, width: "100%", flex: 1 }} />
                  }
                  <Text>{shortenDescription(c.description)}</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  
                </Left>
                <Right>
                  <Button textStyle={{ color: '#87838B' }}
                    onPress={() => this.props.navigation.navigate('DetailUpdateScreen', {
                      campaign: campaign,
                    })}>
                    <Text>Selengkapnya</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          )
        }
      </Content>
    )
  }
}