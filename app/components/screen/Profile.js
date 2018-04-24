import React, { Component } from 'react'
import { AsyncStorage, Image, WebView, BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Storage from 'react-native-storage'
import {
  Container, Content, Card, Button, List, ListItem, Icon, Switch,
  CardItem, Body, Text, Left, Right, StyleProvider, View, Toast
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
  enableCache: false,
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
      isNotification: false,
      showToast: false
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
  }

  logOut() {
    const nav = this.props.navigation
    storage.remove({
      key: 'user'
    })
    storage.load({
      key: 'user'
    }).then(ret => {
      console.log(ret)
    }).catch(err => {
      console.log(err.message)
      Toast.show({
        text: 'Logout Success',
        position: 'bottom',
        buttonText: 'Dismiss'
      })
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
      })
      nav.dispatch(resetAction)
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
                  <Button transparent onPress={() => nav.navigate('EditProfileScreen', { user: this.state.user })}>
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
            </List>
          </View>
          <View style={{ backgroundColor: "#FFF" }}>
            <List>
              <ListItem icon>
                <Left>
                  <Icon name="book" />
                </Left>
                <Body>
                  <Button transparent onPress={() => nav.navigate('TermsScreen')}>
                    <Text style={{ color: '#000000' }}>Syarat dan Ketentuan</Text>
                  </Button>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="bookmarks" />
                </Left>
                <Body>
                  <Button transparent onPress={() => nav.navigate('FaqScreen')}>
                    <Text style={{ color: '#000000' }}>Cara Donasi</Text>
                  </Button>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="information-circle" />
                </Left>
                <Body>
                  <Button transparent onPress={() => nav.navigate('AboutScreen')}>
                    <Text style={{ color: '#000000' }}>Tentang Kami</Text>
                  </Button>
                </Body>
              </ListItem>
            </List>
          </View>
        </Content>
      </Container>
    )
  }
}