import React, { Component } from 'react'
import { AsyncStorage, Image, WebView, BackHandler } from 'react-native'
import Storage from 'react-native-storage'
import {
  Container, Content, Card, Button, List, ListItem, Icon, Switch,
  CardItem, Body, Text, Left, Right, StyleProvider, View
} from 'native-base'
import { styles } from "../config/styles"
import { baseUrl } from "../config/variable"
import { convertToRupiah } from '../config/helper'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'

var storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
})

export default class Profile extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Profile',
    tabBarVisible: false,
  })

  constructor(props) {
    super(props)

    this.state = ({
      user: this.props.navigation.state.params.user,
      showEdit: false,
      isZakat: false,
      isNotification: false
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

  componentWillMount() {
    this.getAccount(this.state.user.id, response => {
      this.setState({
        user: response,
      })
    })

    BackHandler.addEventListener('hardwareBackPress', this.logOut)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.logOut)
  }

  logOut() {
    const nav = this.props.navigation
    storage.remove({
      key: 'user'
    }).then(ret => {
      BackHandler.exitApp()
      return true
    })
  }

  render() {
    const nav = this.props.navigation
    return (
      <Container>
        <Content>
          <Card>
            <CardItem>
              <Body>
                <Text>{this.state.user.name}</Text>
                <Text>{this.state.user.email}</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={{ fontSize: 22 }}>{this.state.user.donasi ? convertToRupiah(this.state.user.donasi) : convertToRupiah(0)}</Text>
                <Text>Donasi</Text>
              </Body>
              <Right>
                <Text style={{ fontSize: 22 }}>{this.state.user.transaksi ? this.state.user.transaksi : '0'}</Text>
                <Text>Transaksi</Text>
              </Right>
            </CardItem>
          </Card>
          <View style={{ backgroundColor: "#FFF" }}>
            <List>
              <ListItem icon>
                <Left>
                  <Icon name="settings" />
                </Left>
                <Body>
                  <Button transparent onPress={() => nav.navigate('EditProfileScreen',{ user: this.state.user })}>
                    <Text style={{ color: '#000000' }}>Edit Profile</Text>
                  </Button>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="exit" />
                </Left>
                <Body>
                  <Button transparent onPress={() => this.logOut()}>
                    <Text style={{ color: '#000000' }}>Log Out</Text>
                  </Button>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="cash" />
                </Left>
                <Body>
                  <Text>Edit Preferensi Zakat</Text>
                </Body>
                <Right>
                  <Switch
                    value={this.state.isZakat}
                    onValueChange={() => { !this.state.isZakat ? this.setState({ isZakat: true }) : this.setState({ isZakat: false }) }} />
                </Right>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="notifications" />
                </Left>
                <Body>
                  <Text>Push Notification</Text>
                </Body>
                <Right>
                  <Switch
                    value={this.state.isNotification}
                    onValueChange={() => { !this.state.isNotification ? this.setState({ isNotification: true }) : this.setState({ isNotification: false }) }} />
                </Right>
              </ListItem>
            </List>
          </View>
          <View style={{ backgroundColor: "#FFF" }}>
            <List>
              <ListItem icon>
                <Left>
                  <Icon name="book" />
                </Left>
                <Body>
                  <Text>Syarat dan Ketentuan</Text>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="bookmarks" />
                </Left>
                <Body>
                  <Text>Kebijakan Privasi</Text>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="information-circle" />
                </Left>
                <Body>
                  <Text>Tentang Berbagi Kebaikan</Text>
                </Body>
              </ListItem>
            </List>
          </View>
        </Content>
      </Container>
    )
  }
}