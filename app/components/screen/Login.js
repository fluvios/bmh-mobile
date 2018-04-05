import React, { Component } from 'react'
import { View, AsyncStorage, Image, Text, WebView, } from 'react-native'
import {
    Container, Item, Input, Header, Body, Content, Icon,
    Title, Button, Label, Spinner, Toast, H1, Form, StyleProvider
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"
import { styles } from "../config/styles"
import PasswordInputText from 'react-native-hide-show-password-input'
const FBSDK = require('react-native-fbsdk')
const {
    LoginButton,
    AccessToken
} = FBSDK
// import OAuthManager from 'react-native-oauth'

// const manager = new OAuthManager('Berbagikebaikan')
// manager.configure({
//     twitter: {
//         consumer_key: 'jCsPnR8eQ1lLP3KC9XlPCRUJo',
//         consumer_secret: '7MwZHve1fX2ThCJnOR6CxHHHp9OHnTTWAUAPV4y5lymP7N78AO'
//     },
//     facebook: {
//         client_id: '1030581603764130',
//         client_secret: '6bfdffc28bd657bb3496ae1fd66d354f'
//     }
// })

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: false,
            showRegister: false,
            showForgot: false,
            email: '',
            password: ''
        }
    }

    getAccount(params, callback) {
        fetch(baseUrl + "api/login", {
            method: "POST",
            body: JSON.stringify(params),
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

    loginAccount(data) {
        const nav = this.props.navigation
        this.getAccount(data, function (response) {
            if (response.status === 'active') {
                storage.save({
                    key: 'user',
                    data: response
                })
                if (nav.state.params) {
                    nav.navigate(nav.state.params.goto, {
                        campaign: nav.state.params.item,
                        user: response
                    })
                    Toast.show({
                        text: 'Login Success',
                        position: 'bottom',
                        buttonText: 'Dismiss'
                    })
                } else {
                    nav.dispatch({
                        type: "Navigation/BACK",
                    })
                    Toast.show({
                        text: 'Login Success',
                        position: 'bottom',
                        buttonText: 'Dismiss'
                    })
                }
            } else {
                Toast.show({
                    text: 'Wrong username or password!',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            }
        })
    }

    showRegister() {
        if (!this.state.showRegister) {
            this.setState({
                showRegister: true,
            })
        } else {
            this.setState({
                showRegister: false,
            })
        }
    }

    showForgot() {
        if (!this.state.showForgot) {
            this.setState({
                showForgot: true,
            })
        } else {
            this.setState({
                showForgot: false,
            })
        }
    }

    componentWillMount() {
        const nav = this.props.navigation
        storage.load({
            key: 'user'
        }).then(ret => {
            if (typeof (nav.state.params.goto) !== 'undefined' || nav.state.params.goto !== null) {
                nav.navigate(nav.state.params.goto, {
                    campaign: nav.state.params.item,
                    user: ret
                })
                Toast.show({
                    text: 'Login Success',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            } else {
                nav.dispatch({
                    type: "Navigation/BACK",
                })
                Toast.show({
                    text: 'Login Success',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    loginFacebook() {
        // manager.authorize('facebook')
        //     .then(resp => console.log(resp))
        //     .catch(err => console.log(err))
    }

    loginTwitter() {
        // manager.authorize('twitter')
        //     .then(resp => console.log(resp))
        //     .catch(err => console.log(err))
    }

    render() {
        const nav = this.props.navigation
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Content padder>
                        <View style={styles.wrapCenter}>
                            <Image source={require('./../../../asset/img/Logo.png')} style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 2
                            }} />
                        </View>
                        <Form>
                            <Item floatingLabel style={{ width: '100%', marginLeft: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0 }}>
                                <Label style={{ color: "#999" }}>Email</Label>
                                <Input
                                    keyboardType='email-address'
                                    onChangeText={(email) => this.setState({ email })}
                                    value={this.state.email} />
                            </Item>
                            <View>
                                <PasswordInputText
                                    value={this.state.password}
                                    onChangeText={(password) => this.setState({ password })}
                                />
                            </View>
                        </Form>
                        <View style={styles.deviderColumn}>
                            <Button block style={{ backgroundColor: '#f38d1f' }} onPress={() => this.loginAccount(this.state)}>
                                <Text style={styles.buttonText}>Masuk</Text>
                            </Button>
                        </View>
                        <View style={styles.deviderColumnDouble}>
                            <View style={styles.deviderRowLeft}>
                                <Button block style={{ backgroundColor: '#f38d1f' }} onPress={() => nav.navigate('RegisterScreen')}>
                                    <Text style={styles.buttonText}>Daftar</Text>
                                </Button>
                            </View>
                            <View style={styles.deviderRowRight}>
                                <Button block style={{ backgroundColor: '#f38d1f' }} onPress={() => nav.navigate('ForgotScreen')}>
                                    <Text style={styles.buttonText}>Lupa Password</Text>
                                </Button>
                            </View>
                        </View>
                        <View style={styles.deviderColumn}>
                            {/* <Button iconLeft block style={{ backgroundColor: '#3b5998' }} onPress={() => this.loginFacebook()}>
                                <Icon name='logo-facebook' />
                                <Text style={styles.buttonText}>Masuk Menggunakan Facebook</Text>
                            </Button> */}
                            <LoginButton
                                publishPermissions={["publish_actions"]}
                                onLoginFinished={
                                    (error, result) => {
                                        if (error) {
                                            alert("login has error: " + result.error);
                                        } else if (result.isCancelled) {
                                            alert("login is cancelled.");
                                        } else {
                                            AccessToken.getCurrentAccessToken().then(
                                                (data) => {
                                                    alert(data.accessToken.toString())
                                                }
                                            )
                                        }
                                    }
                                }
                                onLogoutFinished={() => alert("logout.")} />
                        </View>
                        <View style={styles.deviderColumn}>
                            <Button iconLeft block style={{ backgroundColor: '#00aced' }} onPress={() => this.loginTwitter()}>
                                <Icon name='logo-twitter' />
                                <Text style={styles.buttonText}>Masuk Menggunakan Twitter</Text>
                            </Button>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}