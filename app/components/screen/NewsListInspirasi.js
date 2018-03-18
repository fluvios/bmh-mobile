import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, ListView,
  View, Image, TouchableHighlight, Linking
} from 'react-native';
import {
  Container, Header, Left, Body, Right, Title,
  Content, Footer, FooterTab, Button, Text, Card,
  CardItem, Thumbnail, Spinner,
} from 'native-base';
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper';
import * as Progress from 'react-native-progress';
import { styles } from "../config/styles";
import { wpUrl, baseUrl } from "../config/variable";

var campaignArray = [];

export default class NewsListInspirasi extends Component {

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid != r2.guid
    });
    this.state = ({
      dataSource: dataSource.cloneWithRows(campaignArray),
      isLoading: true,
    })
  }

  componentDidMount() {
    this.getCampaign(function (json) {
      campaignArray = json
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(campaignArray),
        isLoading: false
      })
    }.bind(this));
  }

  getCampaign(callback) {
    fetch(wpUrl + "posts?categories=10", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then(json => callback(json))
      .catch((error) => {
        console.error(error);
      })
      .done();
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Left>
            <Body>
              <Text>{rowData.title.rendered}</Text>
              <Text note>{rowData.date}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            <Image source={{ uri: rowData.better_featured_image.source_url }} style={{ height: 200, width: "95%", flex: 1 }} />
            <Text>
              {shortenDescription(cleanTag(rowData.excerpt.rendered))}
            </Text>
          </Body>
        </CardItem>
        <CardItem>
          <Left />
          <Body />
          <Right>
            <Button textStyle={{ color: '#87838B' }}
              onPress={() => this.props.data.propies.navigation.navigate('DetailScreen', {
                campaign: rowData,
              })}>
              <Text>Read</Text>
            </Button>
          </Right>
        </CardItem>
      </Card>
    );
  }

  render() {
    let campaign = (this.state.isLoading) ?
      <Spinner /> :
      <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />

    return campaign;
  }
}