import React, { Component } from 'react'
import {
    Container, Content, Item, Picker,
    CheckBox, Body, ListItem, Text,
    Button,
} from 'native-base'
import { FlatList, AsyncStorage } from 'react-native'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

export default class SaldoPayment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            funds: [{ id: 1, name: '50000' },
            { id: 2, name: '100000' },
            { id: 3, name: '250000' },
            { id: 4, name: '500000' },
            { id: 5, name: '1000000' },
            ],
            selectedId: 1,
            amount: '50000',
            payment_gateway: '',
            user_id: 0,
        }

        this.loadStorage()
    }

    loadStorage() {
        storage.load({
            key: 'user'
        }).then(ret => this.setState({
            user_id: ret.id
        })).catch(err => {
            console.error(err.message)
        })
    }

    onCheckBoxPress(value) {
        this.setState({
            selectedId: value.id,
            amount: value.name
        })
    }

    onValueChange(value) {
        this.setState({
            payment_gateway: value
        })
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
            case 'Transfer':
                this.topup(form, response => {
                    if (response.status == 'success') {
                        nav.dispatch({
                            type: "Navigation/NAVIGATE",
                            routeName: 'TransferScreen',
                            params: {
                                depositId: response.depositId,
                                userId: form.user_id,
                                amount: donation
                            }
                        })
                    }
                })
                break
            case 'Delivery':
                this.topup(form, response => {
                    if (response.status == 'success') {
                        nav.dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'DeliveryScreen'
                        })
                    }
                })
                break
            case 'Payment':
                nav.navigate('PayScreen', { form: this.state })
                break
        }
    }

    render() {
        return (
            <Container>
                <Content>
                    <Item>
                        <FlatList
                            extraData={this.state}
                            keyExtractor={(item, index) => item.id}
                            data={this.state.funds}
                            renderItem={({ item }) => {
                                return <ListItem>
                                    <CheckBox
                                        checked={this.state.selectedId == item.id}
                                        onPress={() => this.onCheckBoxPress(item)}
                                    />
                                    <Body>
                                        <Text>{item.name}</Text>
                                    </Body>
                                </ListItem>
                            }}
                        />
                    </Item>
                    <Picker
                        iosHeader="Select one"
                        mode="dropdown"
                        selectedValue={this.state.payment_gateway}
                        onValueChange={this.onValueChange.bind(this)}
                    >
                        <Item label="Metode Pembayaran" value="0" />
                        <Item label="Transfer Bank" value="Transfer" />
                        <Item label="Cash On Delivery" value="Delivery" />
                        <Item label="Other" value="Payment" />
                    </Picker>
                    <Button full textStyle={{ color: '#87838B' }}
                        onPress={() => this.paymentMethod()}>
                        <Text>Donate</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}