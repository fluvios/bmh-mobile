import React, { Component, NativeModules } from 'react'
import { View, AsyncStorage, Image, Text, WebView, } from 'react-native'
import { NavigationActions } from 'react-navigation'
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
import { TextField } from 'react-native-material-textfield'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
const FBSDK = require('react-native-fbsdk')
const {
    LoginButton,
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager
} = FBSDK
const Constants = {
    //Dev Parse keys
    TWITTER_COMSUMER_KEY: "jCsPnR8eQ1lLP3KC9XlPCRUJo",
    TWITTER_CONSUMER_SECRET: "7MwZHve1fX2ThCJnOR6CxHHHp9OHnTTWAUAPV4y5lymP7N78AO"
}

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: false,
            showRegister: false,
            showForgot: false,
            email: '',
            password: '',
            user_id: '',
            user: ''
        }

        var _registerUser = this._registerUser
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

    componentDidMount() {
        this._setupGoogleSignin()
    }

    async _setupGoogleSignin() {
        try {
            await GoogleSignin.hasPlayServices({ autoResolve: true })
            await GoogleSignin.configure({
                // For Production
                // webClientId: '1065269558966-0ej6ivq8cm9tr3nf8mhaai9g1lsjt5ul.apps.googleusercontent.com',
                // For Debug
                webClientId: '1065269558966-0ej6ivq8cm9tr3nf8mhaai9g1lsjt5ul.apps.googleusercontent.com',
                offlineAccess: false
            })

            const user = await GoogleSignin.currentUserAsync()
            this.setState({ user })
        }
        catch (err) {
            console.log("Play services error", err.code, err.message)
        }
    }

    _getAccountFromFacebook(params, callback) {
        fetch(baseUrl + "api/login-facebook", {
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

    _registerUser(params, callback) {
        fetch(baseUrl + "api/register", {
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
                    // nav.goBack()
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
                    })
                    nav.dispatch(resetAction)
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

    handleLoginGoogle = () => {
        const nav = this.props.navigation
        GoogleSignin.signIn()
            .then((user) => {
                const form = { user_id: user.id, email: user.email, name: user.name }
                this._getAccountFromFacebook(form, (response) => {
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
                            // nav.goBack()
                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
                            })
                            nav.dispatch(resetAction)
                            Toast.show({
                                text: 'Login Success',
                                position: 'bottom',
                                buttonText: 'Dismiss'
                            })
                        }
                    } else {
                        this._registerUser(form, (response) => {
                            if (response.success == true) {
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
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
                                    })
                                    nav.dispatch(resetAction)
                                    Toast.show({
                                        text: 'Login Success',
                                        position: 'bottom',
                                        buttonText: 'Dismiss'
                                    })
                                }
                            }
                        })
                    }
                })
            })
            .catch((err) => {
                console.log('WRONG SIGNIN', err)
            })
            .done()
    }

    handleLoginFacebook = () => {
        const nav = this.props.navigation
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            (result) => {
                if (result.isCancelled) {
                    console.log('Login cancelled')
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            const form = { user_id: data.userID.toString() }
                            this._getAccountFromFacebook(form, (response) => {
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
                                        // nav.goBack()
                                        const resetAction = NavigationActions.reset({
                                            index: 0,
                                            actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
                                        })
                                        nav.dispatch(resetAction)
                                        Toast.show({
                                            text: 'Login Success',
                                            position: 'bottom',
                                            buttonText: 'Dismiss'
                                        })
                                    }
                                } else {
                                    this._registerUser(form, (response) => {
                                        if (response.success == true) {
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
                                                const resetAction = NavigationActions.reset({
                                                    index: 0,
                                                    actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
                                                })
                                                nav.dispatch(resetAction)
                                                Toast.show({
                                                    text: 'Login Success',
                                                    position: 'bottom',
                                                    buttonText: 'Dismiss'
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    ).catch(err => console.log(err))

                }
            },
            (error) => {
                console.log('Login fail with error: ' + error)
            })
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
                            <View>
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
                            {/* <Button iconLeft block style={{ backgroundColor: '#3b5998' }} onPress={() => this.handleLoginFacebook()}>
                                <Icon name='logo-facebook' />
                                <Text style={styles.buttonText}>Masuk Menggunakan Facebook</Text>
                            </Button> */}
                            <GoogleSigninButton
                                style={{ width: '100%', height: 60 }}
                                size={GoogleSigninButton.Size.Icon}
                                color={GoogleSigninButton.Color.Dark}
                                onPress={this.handleLoginGoogle.bind(this)} />
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}