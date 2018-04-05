import React, { Component } from 'react'
import {
    Container, Header, Title, Button, ListItem,
    Icon, Card, CardItem, Input, Picker, View,
    Left, Body, Right, Content, CheckBox,
    Footer, FooterTab, Text, Form, Item, H1, H3, Toast,
} from 'native-base'
import { Image, Clipboard } from "react-native"
import _ from 'lodash'
import { NavigationActions } from 'react-navigation'
import ImagePicker from 'react-native-image-picker'
import { baseUrl } from '../config/variable'
import { convertToRupiah } from '../config/helper'
import { styles } from "../config/styles"

export default class CampaignTransferPayment extends Component {

    constructor(props) {
        super(props)

        this.state = {
            donation: this.props.navigation.state.params.donation.donation,
            showToast: false,
        }
    }

    goBack() {
        // const resetAction = NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
        // })
        // this.props.navigation.dispatch(resetAction)
        const nav = this.props.navigation
        nav.dispatch({
            type: "Navigation/BACK",
        })
    }

    componentWillUnmount() {
        this.setState({
            donation: {}
        })
    }

    writeAccountToClipboard = async () => {
        await Clipboard.setString('' + this.state.donation.bank.account_number)
        Toast.show({
            text: 'Copied to Clipboard!',
            position: 'bottom',
            buttonText: 'Dismiss'
        })
    }

    writeTotalToClipboard = async () => {
        await Clipboard.setString('' + this.state.donation.donation)
        Toast.show({
            text: 'Copied to Clipboard!',
            position: 'bottom',
            buttonText: 'Dismiss'
        })
    }

    render() {
        console.log(this.state.donation)
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem>
                            <Body style={styles.wrapCenter}>
                                <Image source={require('./../../../asset/img/wallet-add.png')} style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flex: 1
                                }} />
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body style={styles.wrapCenter}>
                                <Text>
                                    Silahkan transfer sebesar :
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <H1>
                                    {convertToRupiah(this.state.donation.donation)}
                                </H1>
                            </Left>
                            <Right>
                                <Button icon transparent onPress={this.writeTotalToClipboard}>
                                    <Icon name='clipboard' />
                                </Button>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Body style={styles.wrapCenter}>
                                <Text>
                                    Pembayaran dapat dilakukan ke rekening atas nama berbagi kebaikan:
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card style={{ flex: 1 }}>
                        <CardItem header style={styles.wrapCenter}>
                            <Text>Rekening Tujuan</Text>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Image source={{ uri: baseUrl + "public/bank/" + this.state.donation.bank.logo }} style={{ height: 50, width: 50, flex: 1, resizeMode: 'center' }} />
                            </Left>
                            <Body style={styles.wrapCenter}>
                                <Text>
                                    {this.state.donation.bank.branch}{`\n`}
                                    {this.state.donation.bank.account_number}
                                </Text>
                            </Body>
                            <Right>
                                <Button icon transparent onPress={this.writeAccountToClipboard}>
                                    <Icon name='clipboard' />
                                </Button>
                            </Right>
                        </CardItem>
                        <CardItem style={styles.wrapCenter}>
                            <Body style={{ backgroundColor: '#FFAA64', padding: 5 }}>
                                <Text>
                                    Mohon transfer tepat hingga <Text style={{ fontWeight: 'bold' }}>3 digit terakhir</Text> agar tidak menghambat proses verifikasi
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem style={styles.wrapCenter}>
                            <Body>
                                <Text>
                                    Pastikan anda transfer sebelum {this.state.donation.expired_date} atau transaksi akan langsung dibatalkan
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