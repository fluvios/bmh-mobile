import React, { Component } from 'react'
import { FlatList, AsyncStorage, Image, WebView } from 'react-native'
import Storage from 'react-native-storage'
import {
    Body, Button, Content, Card, Icon, View, Item, ListItem, Right,
    CardItem, Header, Footer, Text, StyleProvider, CheckBox
} from "native-base"
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { styles } from "../config/styles"
import { baseUrl } from "../config/variable"
import { convertToRupiah } from '../config/helper'
import { ButtonGroup } from 'react-native-elements'

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
            index: 0,
            banks: [
                { id: 'Delivery', name: 'Jemput Cash' },
                { id: 'Midtrans', name: 'Midtrans' },
            ],
            payment_gateway: 'Delivery',
            user_id: 0,
            amount: 50000,
            is_mobile: 1,
            token: ''
        }

        this.bankList()
    }

    bankList() {
        fetch(baseUrl + 'api/bank', {
            method: "GET",
        })
            .then((response) => response.json())
            .then(json => {
                let temp = json
                temp.map((bank, i) => (
                    this.state.banks.push(bank)
                ))
            })
            .catch((error) => {
                console.error(error)
            })
            .done()
    }

    onCheckBoxPress(value) {
        this.setState({
            payment_gateway: value.id,
        })
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
                    saldo: response.saldo,
                    user_id: response.id
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
            this.paymentMethod()
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

    openMidtrans() {
        const html = "<html>" +
            "<head>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
            "<script type='text/javascript' src='https://app.sandbox.midtrans.com/snap/snap.js' data-client-key='VT-client-IXR9xdybkl8pqC-L'></script>" +
            "</head>" +
            "<body>" +
            "<script type='text/javascript'>" +
            "snap.pay('" + this.state.token + "');" +
            "</script>" +
            "</body>" +
            "</html>"

        return (
            <WebView
                style={{ marginTop: 20 }}
                source={{ html: html }} />
        )
    }

    topup(data, callback) {
        fetch(baseUrl + "api/topup", {
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

    paymentMethod() {
        const nav = this.props.navigation
        const form = this.state
        let donation = form.amount
        form.amount = Number.parseInt(this.state.amount)
        switch (this.state.payment_gateway) {
            case 'Delivery':
                this.topup(form, response => {
                    if (response.success == true) {
                        nav.dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'DeliveryScreen'
                        })
                    }
                })
                break
            case 'Midtrans':
                this.topup(form, response => {
                    if (response.success == true) {
                        console.log(response)
                        this.state.token = response.token
                        this.openMidtrans()
                    }
                })
                break
            default:
                form.payment_gateway = Number.parseInt(this.state.payment_gateway)
                console.log(form)
                this.topup(form, response => {
                    if (response.success == true) {
                        nav.dispatch({
                            type: "Navigation/NAVIGATE",
                            routeName: 'TransferScreen',
                            params: {
                                donation: response,
                            }
                        })
                    }
                })
                break
        }
    }

    nominal(index) {
        switch (index) {
            case 0:
                this.setState({
                    amount: 50000
                })
                break
            case 1:
                this.setState({
                    amount: 100000
                })
                break
            case 2:
                this.setState({
                    amount: 250000
                })
                break
            case 3:
                this.setState({
                    amount: 500000
                })
                break
            case 4:
                this.setState({
                    amount: 1000000
                })
                break
        }
    }

    updateIndex = (index) => {
        this.setState({ index })
        this.nominal(index)
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
                    <View style={{ backgroundColor: '#FFFFFF' }}>
                        <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 24 }}>Tambah Saldo</Text>
                        <Text style={{ marginLeft: 10 }}>Nominal Deposit</Text>
                        <ButtonGroup
                            selectedBackgroundColor="pink"
                            onPress={this.updateIndex}
                            selectedIndex={this.state.index}
                            buttons={[
                                convertToRupiah('50000'),
                                convertToRupiah('100000'),
                                convertToRupiah('250000'),
                                convertToRupiah('500000'),
                                convertToRupiah('1000000')
                            ]}
                            containerStyle={{ height: 40 }} />
                    </View>
                    <View style={{ backgroundColor: '#FFFFFF' }}>
                        <Text style={{ marginLeft: 10 }}>Metode Pembayaran</Text>
                        <Item>
                            <FlatList
                                extraData={this.state}
                                keyExtractor={(item, index) => item.id}
                                data={this.state.banks}
                                renderItem={({ item }) => {
                                    return <ListItem>
                                        <CheckBox
                                            checked={this.state.payment_gateway == item.id}
                                            onPress={() => this.onCheckBoxPress(item)}
                                        />
                                        <Body>
                                            <Text>{item.name}</Text>
                                        </Body>
                                        <Right>
                                            <Image source={{ uri: baseUrl + "public/bank/" + item.logo }} style={{ height: 50, width: "100%", flex: 1, resizeMode: 'center' }} />
                                        </Right>
                                    </ListItem>
                                }}
                            />
                        </Item>
                        <Button full textStyle={{ color: '#87838B' }}
                            onPress={() => this.deposit()}>
                            <Text>Tambah Saldo</Text>
                        </Button>
                    </View>
                </Content>
            </StyleProvider >
        )
    }
}