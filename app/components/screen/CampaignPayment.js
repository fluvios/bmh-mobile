import React, { Component } from 'react'
import { Platform, AsyncStorage, FlatList, Image, WebView } from "react-native"
import {
    Container, Header, Title, Button, ListItem, View,
    Icon, Card, CardItem, Input, Picker,
    Left, Body, Right, Content, CheckBox,
    Footer, FooterTab, Text, Form, Item, Toast, StyleProvider
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { NavigationActions } from 'react-navigation'
import Storage from 'react-native-storage'
import { baseUrl } from '../config/variable'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

export default class CampaignPayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: '',
            full_name: this.props.navigation.state.params.user.name,
            email: this.props.navigation.state.params.user.email,
            donation_type: '',
            comment: '',
            anonymous: '',
            campaign_id: this.props.navigation.state.params.campaign.id,
            banks: [
                { id: 'Delivery', name: 'Jemput Cash' },
                { id: 'Midtrans', name: 'Midtrans' },
                { id: 'Deposit', name: 'Potong Saldo' },
            ],
            payment_gateway: 'Delivery',
            user_id: this.props.navigation.state.params.user.id,
            showToast: false,
            is_mobile: 1,
            token: ''
        }

        this.bankList()
    }

    onPaymentChange(value) {
        this.setState({
            payment_gateway: value
        })
    }

    onAnonimChange(value) {
        this.setState({
            anonymous: value
        })
    }

    onDonationChange(value) {
        this.setState({
            donation_type: value
        })
    }

    openMidtrans() {
        const html = "<html>" +
            "<head>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
            "<script type='text/javascript' src='https://app.sandbox.midtrans.com/snap/snap.js' data-client-key='<CLIENT-KEY>'></script>" +
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
                source={{ html: html }}
                onError={error => console.log(error)} />
        )
    }

    goBack() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
        })
        this.props.navigation.dispatch(resetAction)
    }

    paymentMethod() {
        const nav = this.props.navigation
        const form = this.state
        form.amount = Number.parseInt(this.state.amount)
        switch (this.state.payment_gateway) {
            case 'Delivery':
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })
                        nav.dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'DeliveryScreen'
                        })
                    }
                })
                break
            case 'Deposit':
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })

                        this.goBack()
                    }
                })
                break
            case 'Midtrans':
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        this.state.token = response.token
                        this.openMidtrans()
                    }
                })
                break
            default:
                form.payment_gateway = Number.parseInt(this.state.payment_gateway)
                this.donate(this.state.campaign_id, form, response => {
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

    onCheckBoxPress(value) {
        this.setState({
            payment_gateway: value.id,
        })
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

    donate(params, data, callback) {
        fetch(baseUrl + "api/donate/" + params, {
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

    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Content>
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            <Form>
                                <Text>Informasi Donatur</Text>
                                <Item>
                                    <Text>IDR. </Text>
                                    <Input placeholder="Donasi"
                                        onChangeText={(text) => this.setState({ amount: text })}
                                        value={this.state.amount} />
                                </Item>
                                <Item>
                                    <Input placeholder="Fullname"
                                        onChangeText={(text) => this.setState({ full_name: text })}
                                        value={this.state.full_name} />
                                </Item>
                                <Item>
                                    <Input placeholder="Email"
                                        onChangeText={(text) => this.setState({ email: text })}
                                        value={this.state.email} />
                                </Item>
                                <Item>
                                    <Input placeholder="Pesan"
                                        onChangeText={(text) => this.setState({ comment: text })}
                                        value={this.state.comment} />
                                </Item>
                                <View style={{ marginTop: 15, marginBottom: 15 }}>
                                    <View style={{ backgroundColor: '#AAAAAA', height: 20, width: '100%' }}></View>
                                </View>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.donation_type}
                                    onValueChange={this.onDonationChange.bind(this)}>
                                    <Item label="Tipe Donasi" value="" />
                                    <Item label="Routine" value="Routine" />
                                    <Item label="Isidentil" value="Isidentil" />
                                </Picker>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={this.state.anonymous}
                                    onValueChange={this.onAnonimChange.bind(this)}>
                                    <Item label="Donasi sebagai anonim?" value="" />
                                    <Item label="Ya" value="1" />
                                    <Item label="Tidak" value="0" />
                                </Picker>
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
                                <Button block textStyle={{ color: '#87838B' }}
                                    onPress={() => this.paymentMethod()}>
                                    <Text>Donate</Text>
                                </Button>
                            </Form>
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}