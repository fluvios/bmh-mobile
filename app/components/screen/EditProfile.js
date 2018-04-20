import React, { Component } from 'react'
import { View, AsyncStorage, Image, Text, WebView, } from 'react-native'
import {
    Container, Item, Input, Header, Body, Content,
    Title, Button, Label, Spinner, Toast, H1, Form,
} from 'native-base'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"
import { styles } from "../config/styles"
import PasswordInputText from 'react-native-hide-show-password-input'
import { TextField } from 'react-native-material-textfield'
import { NavigationActions } from 'react-navigation'

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
        const nav = this.props.navigation
        return (
            <Container>
                <Content padder>
                    <Form>
                        <View>
                            <TextField
                                label='Nama'
                                value={this.state.name}
                                onChangeText={(name) => this.setState({ name })}
                            />
                            <TextField
                                label='Nomor HP 1'
                                value={this.state.phone_number_1}
                                onChangeText={(phone_number_1) => this.setState({ phone_number_1 })}
                            />
                            <TextField
                                label='Nomor HP 2'
                                value={this.state.phone_number_2}
                                onChangeText={(phone_number_2) => this.setState({ phone_number_2 })}
                            />
                            <TextField
                                label='Alamat Email'
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                            />
                            <PasswordInputText
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                            />
                        </View>
                        <View style={styles.deviderColumn}>
                            <Button block style={{ backgroundColor: '#f38d1f' }} onPress={() => this.editAccount(this.state)}>
                                <Text style={styles.buttonText}>Edit Profile</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        )
    }
}