import React, { Component } from 'react'
import { styles } from "../config/styles"
import { Image, WebView, Dimensions } from 'react-native'
import {
  Container, Header, Left, Body, Right, Title, Icon,
  Content, Footer, FooterTab, Button, Text, Card, Fab,
  CardItem, Thumbnail, Spinner, View
} from 'native-base'
import { cleanTag, convertToRupiah } from '../config/helper'
import * as Progress from 'react-native-progress'
import { baseUrl, color } from "../config/variable"
import Share, { ShareSheet } from 'react-native-share'
import HTML from 'react-native-render-html'
import MyWebView from 'react-native-webview-autoheight'

const MAX_SCREEN_HEIGHT = Dimensions.get('window').height

export default class CampaignDetailText extends Component {

  constructor(props) {
    super(props)
  }

  renderDescription(data) {
    console.log(data)
    const style = `
    <style> 
      img {
        height: 200px !important;
        width: 100% !important;
      }
    </style>
    `
    if (data != undefined || data != null) {
      if (data.includes('iframe')) {

        return (
          <View style={{ flex: 1 }}>
            <View style={{ height: 200, width: 350, alignSelf: 'center' }}>

              <WebView source={{ uri: `https:${data.split('</iframe>')[0].split('"')[1]}` }}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                domStorageEnabled={true} />

            </View>
            <View style={{ height: 3500, width: 350, alignSelf: 'center' }}>
              <MyWebView source={{ html: data.split('</iframe>')[1] }}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                domStorageEnabled={true} />
            </View>
          </View>

        );
      } else {
        return (
          <View style={{ alignSelf: 'center' }}>
            <MyWebView source={{ html: data+style }}
              // style={{ height: 3500, width: 350, flex: 1 }}
              javaScriptEnabled={true}
              scrollEnabled={false}
              domStorageEnabled={true}
              scalesPageToFit={true} />
          </View>

        )
      }

    }
    return null;
  };

  render() {
    const campaign = this.props.data.campaign
    const percent = (campaign.total / (campaign.goal ? campaign.goal : 1))
    let shareOptions = {
      title: "Share Campaign",
      message: campaign.title,
      url: baseUrl + 'campaign/' + campaign.id + '/' + campaign.slug,
      subject: "Share Link" //  for email
    }

    return (
      <Container>
        <Content>
          <View style={{ flex: 0 }}>
          <Image source={{ uri: baseUrl + "public/campaigns/large/" + campaign.large_image }} resizeMode="cover" style={{ height: 200, width: "100%", flex: 1 }} />
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
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Left>
                <Thumbnail source={{ uri: baseUrl + "public/avatar/121523859689c7bdxjdykxpyijl.png" }} />
                <Body>
                  {/* <Text>{campaign.title}</Text> */}
                  <HTML html={campaign.title} />
                  <Text note>{campaign.date}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Deadline: {campaign.deadline}
                </Text>
                <Text style={styles.textInfo}>Dana Terkumpul: {convertToRupiah(campaign.total)}/{convertToRupiah(campaign.goal)}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  {(percent * 100).toFixed(2)} % Dana Terkumpul
              </Text>
                <Progress.Bar progress={percent} width={300} height={10} color={color.lightColor} />
              </Body>
            </CardItem>
          </Card>

          {this.renderDescription(campaign.description)}

        </Content>
      </Container>
    )
  }
}