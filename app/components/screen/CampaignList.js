import React, { Component } from 'react'
import { ScrollView, AsyncStorage, Image, AppState, Modal, FlatList, ListView, RefreshControl } from 'react-native'
import Storage from 'react-native-storage'
import {
  Container, Header, Left, Body, Right, Title, Form, Item, Tabs, Tab, TabHeading,
  Content, Footer, FooterTab, Button, Text, Card, ListItem,
  CardItem, Thumbnail, Spinner, Icon, StyleProvider, View,
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { cleanTag, convertToSlug, shortenDescription, convertToRupiah } from '../config/helper'
import * as Progress from 'react-native-progress'
import { CheckBox } from 'react-native-elements'
import { styles } from "../config/styles"
import { baseUrl, color } from "../config/variable"
import Moment from 'react-moment'
import SplashScreen from 'react-native-splash-screen'

import CampaignListSedekah from "./CampaignListSedekah"
import CampaignListQurban from "./CampaignListQurban"
import CampaignListWakaf from "./CampaignListWakaf"
import CampaignListZakat from "./CampaignListZakat"
import CampaignListFilter from "./CampaignListFilter"

var campaignArray = []
var filterArray = []

var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: false,
})

var isLogin = false

export default class CampaignList extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Berbagi Kebaikan',
    headerRight: (
      <Button icon transparent onPress={() => { navigation.state.params.handleProfile(navigation) }}>
        {isLogin ? <Icon name='contact' style={{ color: '#f38d1f' }} /> : <Text style={{ color: '#f38d1f' }}>Login</Text>}
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
      modalVisible: false,
      appState: AppState.currentState,
      kategori_id: 0,
      funding_id: 0,
      lokasi_id: '',
      refreshing: false,
    })

    var tempArray = []
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

  componentDidMount() {
    SplashScreen.hide()
  }  

  componentWillMount() {
    AppState.addEventListener('change', this.handleAppStateChange)

    this.getCampaign(function (json) {
      campaignArray = json
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(campaignArray),
        isLoading: false
      })

      this.tempArray = campaignArray
    }.bind(this))

    this.getFilter(function (json) {
      filterArray = json
    })

    this.loadStorage()
  }

  filterKategori(text) {
    const newData = this.tempArray.filter(function (item) {
      const itemData = item.kategori
      const textData = text
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

  filterJenisDana(text) {
    const newData = this.tempArray.filter(function (item) {
      const itemData = item.categories_id
      const textData = text
      return itemData == textData
    })

    var tempDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid != r2.guid
    })

    this.setState({
      dataSource: tempDataSource.cloneWithRows(newData),
      text: text
    })
  }

  filterKota(text) {
    const newData = this.tempArray.filter(function (item) {
      const itemData = item.id_kab
      const textData = text
      itemData == textData
    })

    var tempDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.guid != r2.guid
    })

    this.setState({
      dataSource: tempDataSource.cloneWithRows(newData),
      text: text
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.forceUpdate()
    }
    this.setState({ appState: nextAppState })
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
      isLogin = true
      this.props.navigation.setParams({
        handleProfile: this.profile,
        user: ret,
      })
    }).catch(err => {
      console.log(err.message)
      isLogin = false
      this.props.navigation.setParams({
        handleProfile: this.profile,
      })
    })
  }

  profile(navigation) {
    if (navigation.state.params.user) {
      navigation.navigate('ProfileScreen', {
        user: navigation.state.params.user,
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

  getFilter(callback) {
    fetch(baseUrl + "api/filter", {
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

  render() {
    const propies = this.props
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <View style={{ flex: 1 }}>
            <Tabs>
              <Tab heading="Sedekah" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                <CampaignListSedekah data={{ propies }} />
              </Tab>
              <Tab heading="Qurban" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                <CampaignListQurban data={{ propies }} />
              </Tab>
              <Tab heading="Wakaf" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                <CampaignListWakaf data={{ propies }} />
              </Tab>
              <Tab heading="Zakat" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                <CampaignListZakat data={{ propies }} />
              </Tab>
              <Tab heading={ <TabHeading><Icon size={8} name="funnel" /></TabHeading>}>
                <CampaignListFilter data={{ propies }} />
              </Tab>
            </Tabs>
          </View>
        </Container>
      </StyleProvider>
    )
  }
}