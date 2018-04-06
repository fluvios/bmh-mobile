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
        this.updateAccount(data.user_id, data, function (response) {
            if (response.success === true) {
                storage.save({
                    key: 'user',
                    data: response
                })
                nav.dispatch({
                    type: "Navigation/BACK",
                })
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
                        <Item floatingLabel style={{ width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}>
                            <Label>Nama</Label>
                            <Input
                                onChangeText={(name) => this.setState({ name })}
                                value={this.state.name} />
                        </Item>
                        <Item floatingLabel style={{ width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}>
                            <Label>Nomor HP 1</Label>
                            <Input
                                onChangeText={(phone_number_1) => this.setState({ phone_number_1 })}
                                value={this.state.phone_number_1} />
                        </Item>
                        <Item floatingLabel style={{ width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}>
                            <Label>Nomor HP 2</Label>
                            <Input
                                onChangeText={(phone_number_2) => this.setState({ phone_number_2 })}
                                value={this.state.phone_number_2} />
                        </Item>
                        <Item floatingLabel style={{ width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}>
                            <Label>Email Address</Label>
                            <Input
                                onChangeText={(email) => this.setState({ email })}
                                value={this.state.email} />
                        </Item>
                        <View>
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