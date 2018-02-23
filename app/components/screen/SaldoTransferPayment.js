import React, { Component } from 'react'
import {
    Container, Header, Title, Button, ListItem,
    Icon, Card, CardItem, Input, Picker,
    Left, Body, Right, Content, CheckBox,
    Footer, FooterTab, Text, Form, Item, H1, H3, Toast,
} from 'native-base'
import { Image } from "react-native"
import _ from 'lodash'
import { NavigationActions } from 'react-navigation'
import ImagePicker from 'react-native-image-picker'
import { baseUrl } from '../config/variable'
import { convertToRupiah } from '../config/helper'
import { styles } from "../config/styles"

export default class SaldoTransferPayment extends Component {

    constructor(props) {
        super(props)

        this.state = {
            donation: this.props.navigation.state.params.donation.deposit,
        }
    }

    goBack() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
        })
        this.props.navigation.dispatch(resetAction)
    }
    
    componentWillUnmount() {
        this.setState({
            donation: {}
        })
    }

    render() {
        console.log(this.donation)
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
                                    {convertToRupiah(this.state.donation.amount)}
                                </H3>
                                <Text style={styles.textInfo}>
                                    Harap ditransfer sebelum {this.state.donation.expired_date}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <CardItem header>
                                    <Text>Rincian Transfer</Text>
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Text style={styles.textInfo}>Nominal donasi</Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textInfo}>{convertToRupiah((this.state.donation.amount - this.state.donation.amount_key))}</Text>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Text style={styles.textInfo}>Kode transfer (akan disumbangkan)</Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textInfo}>{convertToRupiah(this.state.donation.amount_key)}</Text>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Left>
                                        <Text style={styles.textInfo}>Total</Text>
                                    </Left>
                                    <Right>
                                        <Text style={styles.textInfo}>{convertToRupiah(this.state.donation.amount)}</Text>
                                    </Right>
                                </CardItem>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{ flex: 0 }}>
                        <CardItem header>
                            <Text>Rekening Tujuan</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: baseUrl + "public/bank/" + this.state.donation.bank.logo }} style={{ height: 200, width: "100%", flex: 1, resizeMode: 'center' }} />
                                <Text>
                                    No Rekening {this.state.donation.bank.account_number}{`\n`}
                                    Atas Nama {this.state.donation.bank.account_name}{`\n`}
                                    {this.state.donation.bank.name} Cabang {this.state.donation.bank.branch}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Button full textStyle={{ color: '#87838B' }}
                        onPress={() => this.goBack()}>
                        <Text>Selesai</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
}