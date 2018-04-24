import React, { Component } from 'react'
import { ScrollView, AsyncStorage, Image, AppState, Modal, FlatList, ListView, RefreshControl } from 'react-native'
import Storage from 'react-native-storage'
import {
  Container, Header, Left, Body, Right, Title, Form, Item, H2,
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

var campaignArray = []
var filterArray = []

var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: false,
})

var isLogin = false

export default class CampaignListFilter extends Component {

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
      this.props.data.propies.navigation.setParams({
        handleProfile: this.profile,
        user: ret,
      })
    }).catch(err => {
      console.log(err.message)
      isLogin = false
      this.props.data.propies.navigation.setParams({
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
    fetch(baseUrl + "api/campaign/19", {
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

  renderRow(rowData, sectionID, rowID) {
    const percent = (rowData.total / (rowData.goal ? rowData.goal : 1))
    return (
      <StyleProvider style={getTheme(material)}>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: baseUrl + "public/avatar/121523859689c7bdxjdykxpyijl.png" }} />
              <Body>
                <Text>{rowData.title}</Text>
                <Text note>{rowData.date}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem>
            <Body>
              <Image source={{ uri: baseUrl + "public/avatar/121523859689c7bdxjdykxpyijl.png" + rowData.large_image }} resizeMode="cover" style={{ height: 200, width: "100%", flex: 1 }} />
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
                  <Button style={{ backgroundColor: '#f38d1f' }}
                    onPress={() => this.props.data.propies.navigation.navigate('DetailScreen', {
                      campaign: rowData,
                    })}>
                    <Text>Donate</Text>
                  </Button> :
                  <Button style={{ backgroundColor: '#f38d1f' }}
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

  onKategoriPress(value) {
    this.setState({
      kategori_id: value.id,
    })
  }

  onJenisDanaPress(value) {
    this.setState({
      funding_id: value.id,
    })
  }

  onKotaPress(value) {
    this.setState({
      lokasi_id: value.id_kab,
    })
  }

  filterAll() {
    if (this.state.kategori_id) { this.filterKategori() }
    if (this.state.funding_id) { this.filterJenisDana() }
    if (this.state.lokasi_id) { this.filterKota() }

    this.setModalVisible(!this.state.modalVisible)
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  // render() {
  //   let campaign = (this.state.isLoading) ?
  //     <Spinner /> :
  //     <Container>
  //       <View style={{ flex: 1 }}>
  //         <Modal
  //           animationType={'slide'}
  //           transparent={false}
  //           visible={this.state.modalVisible} onRequestClose={() => {
  //             console.log('Filter added.')
  //           }}>
  //           <Form>
  //             <ScrollView>
  //               <Text>Filter berdasarkan Kategori</Text>
  //               <FlatList
  //                 extraData={this.state}
  //                 keyExtractor={(item, index) => item.id}
  //                 data={filterArray.kategori}
  //                 scrollEnabled={false}
  //                 renderItem={({ item }) => {
  //                   return <CheckBox
  //                     checked={this.state.kategori_id == item.id}
  //                     title={item.nama}
  //                     onPress={() => this.onKategoriPress(item)}
  //                     onIconPress={() => this.onKategoriPress(item)}
  //                     containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
  //                   />
  //                 }}
  //               />
  //               <Text>Filter berdasarkan Jenis Dana</Text>
  //               <FlatList
  //                 extraData={this.state}
  //                 keyExtractor={(item, index) => item.id}
  //                 data={filterArray['jenis-dana']}
  //                 scrollEnabled={false}
  //                 renderItem={({ item }) => {
  //                   return <CheckBox
  //                     checked={this.state.funding_id == item.id}
  //                     title={item.name}
  //                     onPress={() => this.onJenisDanaPress(item)}
  //                     onIconPress={() => this.onJenisDanaPress(item)}
  //                     containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
  //                   />
  //                 }}
  //               />
  //               <Text>Filter berdasarkan Kabupaten/Kota</Text>
  //               <FlatList
  //                 extraData={this.state}
  //                 keyExtractor={(item, index) => item.id}
  //                 data={filterArray.kota}
  //                 scrollEnabled={false}
  //                 renderItem={({ item }) => {
  //                   return <CheckBox
  //                     checked={this.state.lokasi_id == item.id_kab}
  //                     title={item.nama}
  //                     onPress={() => this.onKotaPress(item)}
  //                     onIconPress={() => this.onKotaPress(item)}
  //                     containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
  //                   />
  //                 }}
  //               />
  //               <View style={{ flex: 0 }}>
  //                 <Button full textStyle={{ color: '#87838B' }}
  //                   onPress={() => {
  //                     this.setModalVisible(!this.state.modalVisible);
  //                     this.filterAll();
  //                   }}>
  //                   <Text>Filter</Text>
  //                 </Button>
  //               </View>
  //             </ScrollView>
  //           </Form>
  //         </Modal>
  //         <ListView
  //           refreshControl={
  //             <RefreshControl
  //               refreshing={this.state.refreshing}
  //               onRefresh={this.onRefresh.bind(this)} />
  //           }
  //           dataSource={this.state.dataSource}
  //           renderRow={this.renderRow.bind(this)}
  //           enableEmptySections={true}
  //           removeClippedSubviews={false} >
  //         </ListView>
  //         <Footer>
  //           <FooterTab>
  //             <Button full iconLeft onPress={() => this.setModalVisible(!this.state.modalVisible)}>
  //               <Icon name='funnel' />
  //               <Text>Filter Campaign</Text>
  //             </Button>
  //           </FooterTab>
  //         </Footer>
  //       </View>
  //     </Container>

  //   return campaign
  // }

  render() {
    return (
      <Container>
        <Content padder>
          <H2> Nantikan Fitur Ini Pada Update Selanjutnya </H2>
        </Content>
      </Container>
    )
  }
}