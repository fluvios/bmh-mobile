import React, { Component } from 'react'
import { ListView, AsyncStorage, Image } from 'react-native'
import Storage from 'react-native-storage'
import {
  Container, Header, Left, Body, Right, Title,
  Content, Footer, FooterTab, Button, Text, Card,
  CardItem, Thumbnail, Spinner, Icon, StyleProvider
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { cleanTag, convertToSlug, shortenDescription, convertToRupiah } from '../config/helper'
import * as Progress from 'react-native-progress'
import { styles } from "../config/styles"
import { baseUrl, color } from "../config/variable"
import Moment from 'react-moment'
var campaignArray = []

var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
})

export default class CampaignList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Berbagi Kebaikan',
    headerRight: (
      <Button icon transparent primary onPress={() => { navigation.state.params.handleProfile(navigation) }}>
        <Icon name='contact' />
      </Button>
    ),
  })

  constructor(props) {
    super(props)
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid != r2.guid
    })
    this.state = ({
      dataSource: dataSource.cloneWithRows(campaignArray),
      isLoading: true,
    })
  }

  getAccount(params, callback) {
    fetch(baseUrl + "api/account/" + params + "/refresh", {
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

  loadStorage() {
    storage.load({
      key: 'user'
    }).then(ret => {
      this.props.navigation.setParams({
        handleProfile: this.profile,
        user: ret
      })
    }).catch(err => {
      console.log(err.message)
      this.props.navigation.setParams({
        handleProfile: this.profile,
      })
    })
  }

  componentDidMount() {
    this.getCampaign(function (json) {
      campaignArray = json
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(campaignArray),
        isLoading: false
      })
    }.bind(this))

    this.loadStorage()
  }

  profile(navigation) {
    if (navigation.state.params.user) {
      navigation.navigate('ProfileScreen', {
        user: navigation.state.params.user
      })
    } else {
      navigation.navigate('LoginScreen')
    }
  }

  getCampaign(callback) {
    fetch(baseUrl + "api/campaigns", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => response.json())
      .then(json => callback(json.data))
      .catch((error) => {
        console.error(error)
      })
      .done()
  }

  renderRow(rowData, sectionID, rowID) {
    const percent = (rowData.total / rowData.goal)
    return (
      <StyleProvider style={getTheme(material)}>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: baseUrl + "public/avatar/default.jpg" }} />
              <Body>
                <Text>{rowData.title}</Text>
                <Text note>{rowData.date}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Body>
              <Image source={{ uri: baseUrl + "public/campaigns/large/" + rowData.large_image }} style={{ height: 200, width: "100%", flex: 1 }} />
            </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Text style={styles.textInfo}>{`Dana Terkumpul: \n`}{convertToRupiah(rowData.total)}/{convertToRupiah(rowData.goal)}</Text>
            </Left>
            <Right>
              <Text style={styles.textDate}>{rowData.days_remaining > 0 ? rowData.days_remaining : 0} {`\n`}</Text>
              <Text style={styles.textInfo}>Hari lagi</Text>
            </Right>
          </CardItem>
          <CardItem>
            <Left>
              <Progress.Circle progress={percent} size={50} showsText={true} color={color.lightColor} />
            </Left>
            <Right>
              {
                rowData.finalized == '0' ?
                  <Button textStyle={{ color: '#87838B' }}
                    onPress={() => this.props.navigation.navigate('DetailScreen', {
                      campaign: rowData,
                    })}>
                    <Text>Donate</Text>
                  </Button> :
                  <Button textStyle={{ color: '#87838B' }}
                    onPress={() => { }}>
                    <Text>Finish</Text>
                  </Button>
              }

            </Right>
          </CardItem>
        </Card>
      </StyleProvider>
    )
  }

  render() {
    let campaign = (this.state.isLoading) ?
      <Spinner /> :
      <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />

    return campaign
  }
}