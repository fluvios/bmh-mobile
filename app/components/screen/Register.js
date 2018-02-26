import React, { Component } from 'react'
import { View, AsyncStorage, Image } from 'react-native'
import {
    Container, Item, Input, Header, Body, Content,
    Title, Button, Text, Label, Spinner, Toast
} from 'native-base'
import { Field, reduxForm, submit } from 'redux-form'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"

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

class Register extends Component {
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
                    <Image source={require('./../../../asset/img/Logo-2.png')} style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} />
                    <Image source={require('./../../../asset/img/Logo-3.png')} style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} />
                    <Field name="email" component={this.renderInput} />
                    <Field name="password" component={this.renderInput} />
                    <Button block primary onPress={handleSubmit(this.loginAccount.bind(this))}>
                        <Text>Login</Text>
                    </Button>
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
