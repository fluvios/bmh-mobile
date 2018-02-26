import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import Storage from 'react-native-storage'
import {
    Body, Button, Content, Card, Icon,
    CardItem, Header, Footer, Text, StyleProvider
} from "native-base"
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { styles } from "../config/styles"
import { baseUrl } from "../config/variable"
import { convertToRupiah } from '../config/helper'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

export default class DepositoList extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Berbagi Kebaikan',
        headerRight: (
            <Button icon transparent onPress={() => { navigation.state.params.handleProfile(navigation) }}>
                <Icon name='contact' />
            </Button>
        ),
    })

    constructor(props) {
        super(props)
        this.state = {
            saldo: 0,
        }
    }

    profile(navigation) {
        if (navigation.state.params.user) {
            navigation.navigate('ProfileScreen', {
                user: navigation.state.params.user
            })
        } else {
            navigation.navigate('LoginScreen')
        }
    }

    componentWillMount() {
        this.loadStorage()
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

    loadStorage() {
        storage.load({
            key: 'user'
        }).then(ret => {
            this.getAccount(ret.id, response => {
                this.setState({
                    saldo: response.saldo
                })
            })
            this.props.navigation.setParams({
                handleProfile: this.profile,
                user: ret
            })
        }).catch(err => {
            console.log(err.message)
            this.props.navigation.setParams({
                handleProfile: this.profile,
            })
        })
    }

    deposit() {
        storage.load({
            key: 'user'
        }).then(ret => {
            this.props.navigation.navigate('DonateScreen', {
                user: ret
            })
        }).catch(err => {
            // console.error(err.message)
            switch (err.name) {
                case 'NotFoundError':
                    this.props.navigation.navigate('LoginScreen')
                    break
                case 'ExpiredError':
                    storage.remove({
                        key: 'user'
                    })
                    this.props.navigation.navigate('LoginScreen')
                    break
            }
        })
    }

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text style={styles.textHeader}>Saldo BMH</Text>
                                <Text style={styles.textContent}>{convertToRupiah(this.state.saldo)}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Button full textStyle={{ color: '#87838B' }}
                        onPress={() => this.deposit()}>
                        <Text>Add Saldo</Text>
                    </Button>
                </Content>
            </StyleProvider>
        )
    }
}