import React, { Component } from 'react'
import { Platform, AsyncStorage } from "react-native"
import {
    Container, Header, Title, Button, ListItem,
    Icon, Card, CardItem, Input, Picker,
    Left, Body, Right, Content, CheckBox,
    Footer, FooterTab, Text, Form, Item, Toast,
} from 'native-base'
import _ from 'lodash'
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
            payment_gateway: '',
            comment: '',
            anonymous: '',
            campaign_id: this.props.navigation.state.params.campaign.id,
            banks: [],
            user_id: 0,
            showToast: false
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
                    }
                })
                break
            case 'Payment':
                nav.navigate('PayScreen', { form: form })
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
                this.setState({
                    banks: json
                })
            })
            .catch((error) => {
                console.error(error)
            })
            .done()
    }

    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Text>Informasi Donatur</Text>
                        <Item>
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
                        <Picker
                            mode="dropdown"
                            selectedValue={this.state.payment_gateway}
                            onValueChange={this.onPaymentChange.bind(this)}>
                            <Item label="Metode Pembayaran" value="" />
                            {
                                this.state.banks.map((bank, i) =>
                                    <Item key={i} label={"Transfer " + bank.name} value={bank.id} />
                                )
                            }
                            <Item label="Cash On Delivery" value="Delivery" />
                            <Item label="Potong Saldo BMH" value="Deposit" />
                            <Item label="Other" value="Payment" />
                        </Picker>
                        <Button block textStyle={{ color: '#87838B' }}
                            onPress={() => this.paymentMethod()}>
                            <Text>Donate</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
}