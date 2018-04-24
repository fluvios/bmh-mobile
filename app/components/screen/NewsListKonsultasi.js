import React, { Component } from 'react'
import {
  StyleSheet, ScrollView, ListView,
  View, Image, TouchableHighlight, Linking, RefreshControl
} from 'react-native'
import {
  Container, Header, Left, Body, Right, Title,
  Content, Footer, FooterTab, Button, Text, Card,
  CardItem, Thumbnail, Spinner, Item, Input
} from 'native-base'
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper'
import * as Progress from 'react-native-progress'
import { styles } from "../config/styles"
import { wpUrl, baseUrl } from "../config/variable"
import HTML from 'react-native-render-html'

var campaignArray = []

export default class NewsListKonsultasi extends Component {

  constructor(props) {
    super(props)
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid != r2.guid
    })
    this.state = ({
      dataSource: dataSource.cloneWithRows(campaignArray),
      isLoading: true,
      refreshing: false
    })

    this.tempArray = []
  }

  componentDidMount() {
    this.getCampaign(function (json) {
      campaignArray = json
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(campaignArray),
        isLoading: false
      })
      this.tempArray = campaignArray
    }.bind(this))
  }

  onRefresh() {
    this.setState({ refreshing: true })
    this.getCampaign(function (json) {
      campaignArray = json
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(campaignArray),
        isLoading: false
      })

      this.tempArray = campaignArray
      this.setState({ refreshing: false })
    }.bind(this))
  }

  getCampaign(callback) {
    fetch(wpUrl + "posts?categories=268", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then(json => callback(json))
      .catch((error) => {
        console.error(error)
      })
      .done()
  }

  SearchFilterFunction(text) {
    const newData = this.tempArray.filter(function (item) {
      const itemData = cleanTag(item.title.rendered.toUpperCase())
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })

    var tempDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid != r2.guid
    })

    this.setState({
      dataSource: tempDataSource.cloneWithRows(newData),
      text: text
    })
  }

  onRefresh() {
    this.setState({ refreshing: true })
    this.getCampaign(function (json) {
      campaignArray = json
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(campaignArray),
        isLoading: false
      })

      this.tempArray = campaignArray
      this.setState({ refreshing: false })
    }.bind(this))
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Left>
            <Body>
              <Text onPress={() => this.props.data.propies.navigation.navigate('DetailScreen', {
                campaign: rowData,
              })}>{cleanTag(rowData.title.rendered)}</Text>
              {/* <HTML html={rowData.title.rendered} /> */}
              <Text note>{rowData.date}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Image source={{ uri: rowData.better_featured_image.source_url }} resizeMode="cover" style={{ height: 200, width: "95%", flex: 1 }} />
            <Text>
              {shortenDescription(cleanTag(rowData.excerpt.rendered))}
            </Text>
          </Body>
        </CardItem>
        {/* <CardItem>
          <Left />
          <Body />
          <Right>
            <Button style={{ backgroundColor: '#f38d1f' }}
              onPress={() => this.props.data.propies.navigation.navigate('DetailScreen', {
                campaign: rowData,
              })}>
              <Text>Read</Text>
            </Button>
          </Right>
        </CardItem> */}
      </Card>
    )
  }

  render() {
    let campaign = (this.state.isLoading) ?
      <Spinner /> :
      <Container>
        <Content>
          <Item regular style={{ width: '100%', marginHorizontal: 0, marginVertical: 5, paddingHorizontal: 0 }}>
            <Input placeholder='Search' onChangeText={(text) => this.SearchFilterFunction(text)}
              value={this.state.text} />
          </Item>

          <ListView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)} />
            }
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            removeClippedSubviews={false} >
          </ListView>
        </Content>
      </Container>

    return campaign
  }
}