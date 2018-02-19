import React, { Component } from 'react';
import { View, AsyncStorage, Image } from 'react-native';
import {
    Container, Item, Input, Header, Body, Content,
    Title, Button, Text, Label, Spinner, Toast
} from 'native-base';
import { Field, reduxForm, submit } from 'redux-form';
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
})

const validate = values => {
    const error = {};
    error.email = '';
    error.password = '';
    var ema = values.email;
    var pass = values.password;
    if (values.email === undefined) {
        ema = '';
    }
    if (values.password === undefined) {
        pass = '';
    }
    if (ema.length < 8 && ema !== '') {
        error.email = 'Format email belum benar';
    }
    if (!ema.includes('@') && ema !== '') {
        error.email = 'Format email belum benar';
    }
    if (pass.length < 0) {
        error.password = 'Password masih belum dinputkan';
    }
    return error;
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            showToast: false
        };
        this.renderInput = this.renderInput.bind(this);
    }

    async componentWillMount() {
        this.setState({ isReady: true });
    }

    getAccount(params, callback) {
        fetch("http://galangbersama.com/api/login", {
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
                console.error(error);
            })
            .done();
    }

    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        var hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        let isSecure = false;
        if (input.name == 'password') {
            isSecure = true;
        }
        return (
            <Item stackedLabel error={hasError}>
                <Label>{input.name}</Label>
                <Input {...input} secureTextEntry={isSecure} />
            </Item>
        )
    }

    loginAccount(data) {
        this.getAccount(data, function (response) {
            if (response.status === 'active') {
                storage.save({
                    key: 'user',
                    data: response
                });
                this.props.navigation.navigate('HomeScreen', ({ storage: storage }))
            } else {
                Toast.show({
                    text: 'Wrong username or password!',
                    position: 'bottom',
                    buttonText: 'Okay'
                })
            }
        }.bind(this));
    }

    loginForm() {
        const { handleSubmit, reset } = this.props;
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
        storage.load({
            key: 'user'
        }).then(ret => {
            if (ret) {
                this.props.navigation.navigate('HomeScreen')
            }
        }).catch(err => {
            console.log(err.message);
        });
    }

    render() {
        return this.loginForm()
    }
}

export default reduxForm({
    form: 'login',
    validate
})(Login)
