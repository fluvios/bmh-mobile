import React, { Component } from 'react'
import { View, AsyncStorage, Image, Text, WebView, } from 'react-native'
import {
    Container, Item, Input, Header, Body, Content, Tab, Tabs,
    Title, Button, Label, Spinner, Toast, H1, Form, StyleProvider,
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"
import { styles } from "../config/styles"
import PasswordInputText from 'react-native-hide-show-password-input'
import { TextField } from 'react-native-material-textfield'
import { NavigationActions } from 'react-navigation'

import EditProfileAddress from "./EditProfileAddress"
import EditProfileUser from "./EditProfileUser"

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

export default class EditProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: false,
            email: '',
            password: '',
            name: '',
            phone_number_1: '',
            phone_number_2: '',
            user_id: '',
        }
    }

    updateAccount(params, data, callback) {
        fetch(baseUrl + "api/account/" + params + "/edit", {
            method: "POST",
            body: JSON.stringify(data),
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

    editAccount(data) {
        const nav = this.props.navigation
        this.updateAccount(data.user_id, data, (response) => {
            if (response.success === true) {
                storage.save({
                    key: 'user',
                    data: response.response
                })
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'ProfileScreen', params: { user: response.response } })],
                })
                nav.dispatch(resetAction)
                Toast.show({
                    text: 'Edit Profile Success',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            } else {
                Toast.show({
                    text: 'Edit Profile Failed',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            }
        })
    }

    componentWillMount() {
        const nav = this.props.navigation
        storage.load({
            key: 'user'
        }).then(ret => {
            this.getAccount(ret.id, response => {
                this.setState({
                    user_id: ret.id,
                    email: ret.email,
                    name: ret.name,
                    phone_number_1: ret.phone_number_1,
                    phone_number_2: ret.phone_number_2,
                })
            })
        }).catch(err => {
            console.log(err.message)
        })
    }

    render() {
        const propies = this.props
        return (
            <StyleProvider style={getTheme(material)}>
            <Container>
              <View style={{ flex: 1 }}>
                <Tabs>
                  <Tab heading="Data Personal" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                    <EditProfileUser data={{ propies }} />
                  </Tab>
                  <Tab heading="Alamat" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                    <EditProfileAddress data={{ propies }} />
                  </Tab>
                </Tabs>
              </View>
            </Container>
          </StyleProvider>
        )
    }
}