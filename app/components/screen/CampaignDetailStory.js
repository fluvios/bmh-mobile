import React, { Component } from 'react'
import { Image } from 'react-native'
import {
  Container, Header, Content, Card, CardItem,
  Body, Text, Left, Right, Button, Fab, View, Icon
} from 'native-base'
import { cleanTag, convertToSlug, shortenDescription, convertToRupiah } from '../config/helper'
import { baseUrl } from "../config/variable"
import Share, { ShareSheet } from 'react-native-share'

export default class CampaignDetailStory extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let campaign = this.props.data.campaign
    let shareOptions = {
      title: "Share Campaign",
      message: campaign.title,
      url: baseUrl + 'campaign/' + campaign.id + '/' + campaign.slug,
      subject: "Share Link" //  for email
    }

    return (
      <Content>
        <View style={{ flex: 1 }}>
          <Image source={{ uri: baseUrl + "public/campaigns/large/" + campaign.large_image }} style={{ height: 200, width: "100%", flex: 1 }} />
          <Fab
            containerStyle={{}}
            style={{ backgroundColor: '#5067FF', zIndex: 1 }}
            position="bottomRight"
            onPress={() => {
              Share.open(shareOptions);
            }}>
            <Icon name="share" />
          </Fab>
        </View>
        {
          campaign.update.map((c) =>
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