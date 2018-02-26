import React, { Component } from 'react'
import { View, AsyncStorage, Image, Text, WebView, } from 'react-native'
import {
    Container, Item, Input, Header, Body, Content,
    Title, Button, Label, Spinner, Toast, H1
} from 'native-base'
import { Field, reduxForm, submit } from 'redux-form'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"
import { styles } from "../config/styles"

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

const validate = values => {
    const error = {}
    error.email = ''
    error.password = ''
    var ema = values.email
    var pass = values.password
    if (values.email === undefined) {
        ema = ''
    }
    if (values.password === undefined) {
        pass = ''
    }
    if (ema.length < 8 && ema !== '') {
        error.email = 'Format email belum benar'
    }
    if (!ema.includes('@') && ema !== '') {
        error.email = 'Format email belum benar'
    }
    if (pass.length < 0) {
        error.password = 'Password masih belum dinputkan'
    }
    return error
}

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isReady: false,
            showToast: false
        }
        this.renderInput = this.renderInput.bind(this)
    }

    async componentWillMount() {
        this.setState({ isReady: true })
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

    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        var hasError = false
        if (error !== undefined) {
            hasError = true
        }
        let isSecure = false
        if (input.name == 'password') {
            isSecure = true
        }
        return (
            <Item stackedLabel error={hasError}>
                <Label>{input.name}</Label>
                <Input {...input} secureTextEntry={isSecure} />
            </Item>
        )
    }

    loginAccount(data) {
        const nav = this.props.navigation
        this.getAccount(data, function (response) {
            if (response.status === 'active') {
                storage.save({
                    key: 'user',
                    data: response
                })
                nav.dispatch({
                    type: "Navigation/BACK",
                })
                Toast.show({
                    text: 'Login Success',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            } else {
                Toast.show({
                    text: 'Wrong username or password!',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            }
        }.bind(this))
    }

    loginForm() {
        const { handleSubmit, reset } = this.props
        return (
            <Container>
                <Content padder>
                    <View style={styles.wrapCenter}>
                        <Image source={require('./../../../asset/img/Logo-2.png')} style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 2
                        }} />
                        <Text style={styles.middleText}>Berbagi Kebaikan</Text>
                    </View>
                    <Field name="email" component={this.renderInput} />
                    <Field name="password" component={this.renderInput} />
                    <View style={styles.deviderColumn}>
                        <Button block primary onPress={handleSubmit(this.loginAccount.bind(this))}>
                            <Text style={styles.buttonText}>Masuk</Text>
                        </Button>
                    </View>
                    <View style={styles.deviderColumnDouble}>
                        <View style={styles.deviderRowLeft}>
                            <Button block primary onPress={() => {
                                return (
                                    <View>
                                        <WebView
                                            source={{ uri: baseUrl }}
                                            style={{ marginTop: 20 }}
                                        />
                                    </View>
                                )
                            }}>
                                <Text style={styles.buttonText}>Daftar</Text>
                            </Button>
                        </View>
                        <View style={styles.deviderRowRight}>
                            <Button block primary onPress={() => {
                                return (<WebView
                                    source={{ uri: baseUrl }}
                                    style={{ marginTop: 20 }}
                                />)
                            }}>
                                <Text style={styles.buttonText}>Lupa Password</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.deviderColumn}>
                        <Button block primary>
                            <Text style={styles.buttonText}>Masuk Menggunakan Facebook</Text>
                        </Button>
                    </View>
                    <View style={styles.deviderColumn}>
                        <Button block info>
                            <Text style={styles.buttonText}>Masuk Menggunakan Twitter</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }

    componentWillMount() {
        const nav = this.props.navigation
        storage.load({
            key: 'user'
        }).then(ret => {
            if (ret) {
                nav.dispatch({
                    type: "Navigation/BACK",
                })
            }
        }).catch(err => {
            console.log(err.message)
        })
    }

    render() {
        return this.loginForm()
    }
}

export default reduxForm({
    form: 'login',
    validate
})(Login)
