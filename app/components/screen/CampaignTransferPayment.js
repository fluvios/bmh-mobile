import React, { Component } from 'react'
import {
    Container, Header, Title, Button, ListItem,
    Icon, Card, CardItem, Input, Picker,
    Left, Body, Right, Content, CheckBox,
    Footer, FooterTab, Text, Form, Item, H1, H3, Toast,
} from 'native-base'
import { Image } from "react-native"
import _ from 'lodash'
import ImagePicker from 'react-native-image-picker'
import { baseUrl } from '../config/variable'

export default class CampaignTransferPayment extends Component {

    constructor(props) {
        super(props)

        console.log(this.props)

        this.state = {
            showToast: false,
            donation: this.props.navigation.state.params.donation.donation
        }

        amount = "" + this.state.donation.donation
        key = "" + this.state.donation.amount_key
        donate = "" + (this.state.donation.donation - this.state.donation.amount_key)
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <H1>
                                    Total Transfer
                                </H1>
                                <H3>
                                    IDR. {amount}
                                </H3>
                                <Text>
                                    Harap ditransfer sebelum {this.state.donation.expired_date}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <CardItem header>
                                    <Text>Rekening Transfer</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>

                                    </Body>
                                </CardItem>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        )
    }
}