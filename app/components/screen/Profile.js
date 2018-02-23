import React, { Component } from 'react'
import { AsyncStorage, Image } from 'react-native'
import Storage from 'react-native-storage'
import {
  Container, Content, Card, Button,
  CardItem, Body, Text, H2
} from 'native-base'
import { styles } from "../config/styles"
import { baseUrl } from "../config/variable"
import { convertToRupiah } from '../config/helper'

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
      user: this.props.navigation.state.params.user
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
        user: response
      })
    })
  }

  logOut() {
    const nav = this.props.navigation
    storage.remove({
      key: 'user'
    }).then(ret => {
      nav.dispatch({
        type: 'Navigation/BACK',
      })
    })
  }

  render() {
    return (
      <Container>
        <Content>
          <Image source={{ uri: baseUrl + 'public/avatar/' + this.state.user.avatar }} style={{ height: 300, width: "100%", flex: 1 }} />
          <Card>
            <CardItem>
              <Body>
                <H2>{this.state.user.name}</H2>
                <H2>{this.state.user.email}</H2>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <H2>Saldo:</H2>
                <H2>{convertToRupiah(this.state.user.saldo)}</H2>
              </Body>
            </CardItem>
          </Card>
          <Button full textStyle={{ color: '#87838B' }}
            onPress={() => this.logOut()}>
            <Text>Log Out</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}