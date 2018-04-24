import React, { Component } from 'react'
import { Platform, AsyncStorage, FlatList, Image, WebView, Modal, TouchableWithoutFeedback, ActivityIndicator } from "react-native"
import {
    Container, Header, Title, Button, ListItem, View,
    Icon, Card, CardItem, Input, Picker,
    Left, Body, Right, Content, Footer, FooterTab,
    Text, Form, Item, Toast, StyleProvider, Tabs, Tab
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { NavigationActions } from 'react-navigation'
import { CheckBox } from 'react-native-elements'
import { convertToAngka, convertToRupiah } from '../config/helper'
import Storage from 'react-native-storage'
import { baseUrl } from '../config/variable'
import { TextField } from 'react-native-material-textfield'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

export default class CampaignPayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            amount: '',
            full_name: this.props.navigation.state.params.user.name,
            email: this.props.navigation.state.params.user.email,
            donation_type: 'Routine',
            comment: '',
            anonymous: false,
            modalVisible: false,
            buttonVisible: false,
            animating: false,
            campaign_id: this.props.navigation.state.params.campaign.id,
            banks: [
                // { id: 'Delivery', name: 'Jemput Cash' },
                { id: 'Midtrans', label: 'Multipayment' },
                { id: 'Deposit', label: 'Potong Saldo' },
            ],
            payment_gateway: 'Delivery',
            user_id: this.props.navigation.state.params.user.id,
            showToast: false,
            is_mobile: 1,
            // Zakat Fitrah
            jumlahKeluarga: '',
            hargaBeras: '8900',
            jumlahZakatFitrah: '',
            // Zakat Maal
            cash: '',
            asset: '',
            debt: '',
            gold: '',
            stock: '',
            invest: '',
            hargaEmas: '586933',
            nishabEmas: '49889305',
            hartaTotal: '',
            jumlahZakatMal: '',
            maalState: '',
            // Zakat Profesi
            gaji: '',
            tunjangan: '',
            pendapatanTotal: '',
            nishabBeras: '4628000',
            jumlahZakatProfesi: '',
            profesiState: ''
        }

        this.bankList()
    }

    onPaymentChange(value) {
        this.setState({
            payment_gateway: value
        })
    }

    onDonationChange(value) {
        this.setState({
            donation_type: value
        })
    }

    goBack() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'ListScreen' })],
        })
        this.props.navigation.dispatch(resetAction)
    }

    paymentMethod() {
        this.setState({ animating: true })
        const nav = this.props.navigation
        const form = this.state
        form.amount = Number.parseInt(this.state.amount)
        form.anonymous = this.state.anonymous ? '1' : '0'
        switch (this.state.payment_gateway) {
            case 'Delivery':
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })
                        this.setState({ animating: false })
                        nav.dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'DeliveryScreen'
                        })
                    } else {
                        console.log(response)
                        this.setState({ animating: false })
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
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
                        this.setState({ animating: false })
                        this.goBack()
                    } else {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })
                        this.setState({ animating: false })
                    }
                })
                break
            case 'Midtrans':
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        const token = response.token
                        this.setState({ animating: false })
                        nav.dispatch({
                            type: "Navigation/NAVIGATE",
                            routeName: 'MidtransScreen',
                            params: {
                                token: token,
                            }
                        })
                    } else {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })
                        this.setState({ animating: false })
                    }
                })
                break
            default:
                form.payment_gateway = Number.parseInt(this.state.payment_gateway)
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        this.setState({ animating: false })
                        nav.dispatch({
                            type: "Navigation/NAVIGATE",
                            routeName: 'TransferScreen',
                            params: {
                                donation: response,
                            }
                        })
                    } else {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })
                        this.setState({ animating: false })
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

    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }

    render() {
        let campaign = this.props.navigation.state.params.campaign

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.modalVisible} onRequestClose={() => {
                            console.log('Modal has been closed.');
                        }}>
                        <Container>
                            <Header style={{ backgroundColor: '#fff' }}>
                                <Left>
                                    <Button transparent onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                        <Icon style={{ color: '#000' }} name='arrow-round-back' />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title style={{ color: '#000' }}>Kalkulator</Title>
                                </Body>
                                <Right />
                            </Header>
                            <Content>
                                <Tabs>
                                    <Tab heading="Fitrah">
                                        <Content padder>
                                            <Form>
                                                <View>
                                                    <TextField label="Jumlah Anggota Keluarga"
                                                        onChangeText={(text) => this.setState({ jumlahKeluarga: text, jumlahZakatFitrah: (parseInt(text) * parseInt(this.state.hargaBeras) * 3.5).toString() })}
                                                        value={this.state.jumlahKeluarga ? this.state.jumlahKeluarga : ''}
                                                        keyboardType='numeric' />
                                                </View>
                                                <View>
                                                    <TextField label="Harga Beras"
                                                        value={this.state.hargaBeras ? convertToRupiah(this.state.hargaBeras) : ''}
                                                        onChangeText={(text) => this.setState({ hargaBeras: convertToAngka(text), jumlahZakatFitrah: (parseInt(this.state.jumlahKeluarga) * convertToAngka(text) * 3.5).toString() })}
                                                        keyboardType='numeric' />
                                                </View>
                                                <View>
                                                    <TextField disabled label="Jumlah Zakat Fitrah"
                                                        value={!isNaN(this.state.jumlahZakatFitrah) ? convertToRupiah(this.state.jumlahZakatFitrah) : '0'} />
                                                </View>
                                                <View style={{ flexDirection: 'row' }} >
                                                    <View style={{ flex: 1 }}>
                                                        <Button style={{ backgroundColor: '#C40018' }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    jumlahKeluarga: '',
                                                                    hargaBeras: '8900',
                                                                    jumlahZakatFitrah: ''
                                                                })
                                                            }}>
                                                            <Text>Hapus</Text>
                                                        </Button>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <Button textStyle={{ color: '#87838B' }}
                                                            onPress={() => {
                                                                this.setModalVisible(!this.state.modalVisible);
                                                                this.setState({ amount: convertToAngka(this.state.jumlahZakatFitrah) })
                                                            }}>
                                                            <Text>Hitung</Text>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </Form>
                                        </Content>
                                    </Tab>
                                    <Tab heading="Maal">
                                        <Content padder>
                                            <Form>
                                                <View>
                                                    <TextField label="Uang Kas & Bank"
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.asset ? parseInt(this.state.asset) : 0) +
                                                                    (this.state.debt ? parseInt(this.state.debt) : 0) + (this.state.gold ? parseInt(this.state.gold) : 0) +
                                                                    (this.state.stock ? parseInt(this.state.stock) : 0) + (this.state.invest ? parseInt(this.state.invest) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    cash: convertToAngka(text),
                                                                })
                                                            }
                                                        }
                                                        keyboardType='numeric'
                                                        value={this.state.cash ? convertToRupiah(this.state.cash) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Total Asset (yg digunakan tidak perlu dihitung)"
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.cash ? parseInt(this.state.cash) : 0) +
                                                                    (this.state.debt ? parseInt(this.state.debt) : 0) + (this.state.gold ? parseInt(this.state.gold) : 0) +
                                                                    (this.state.stock ? parseInt(this.state.stock) : 0) + (this.state.invest ? parseInt(this.state.invest) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    asset: convertToAngka(text),
                                                                })
                                                            }
                                                        }
                                                        keyboardType='numeric'
                                                        value={this.state.asset ? convertToRupiah(this.state.asset) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Piutang Tertagih"
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.asset ? parseInt(this.state.asset) : 0) +
                                                                    (this.state.cash ? parseInt(this.state.cash) : 0) + (this.state.gold ? parseInt(this.state.gold) : 0) +
                                                                    (this.state.stock ? parseInt(this.state.stock) : 0) + (this.state.invest ? parseInt(this.state.invest) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    debt: convertToAngka(text),
                                                                })
                                                            }
                                                        }
                                                        keyboardType='numeric'
                                                        value={this.state.debt ? convertToRupiah(this.state.debt) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Emas & Perhiasan lain"
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.asset ? parseInt(this.state.asset) : 0) +
                                                                    (this.state.debt ? parseInt(this.state.debt) : 0) + (this.state.cash ? parseInt(this.state.cash) : 0) +
                                                                    (this.state.stock ? parseInt(this.state.stock) : 0) + (this.state.invest ? parseInt(this.state.invest) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    gold: convertToAngka(text),
                                                                })
                                                            }
                                                        }
                                                        keyboardType='numeric'
                                                        value={this.state.gold ? convertToRupiah(this.state.gold) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Saham, obligasi, dana pensiun, asuransi yang diterima"
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.asset ? parseInt(this.state.asset) : 0) +
                                                                    (this.state.debt ? parseInt(this.state.debt) : 0) + (this.state.gold ? parseInt(this.state.gold) : 0) +
                                                                    (this.state.cash ? parseInt(this.state.cash) : 0) + (this.state.invest ? parseInt(this.state.invest) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    stock: convertToAngka(text),
                                                                })
                                                            }
                                                        }
                                                        keyboardType='numeric'
                                                        value={this.state.stock ? convertToRupiah(this.state.stock) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Dana yg diinvestasikan"
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.asset ? parseInt(this.state.asset) : 0) +
                                                                    (this.state.debt ? parseInt(this.state.debt) : 0) + (this.state.gold ? parseInt(this.state.gold) : 0) +
                                                                    (this.state.stock ? parseInt(this.state.stock) : 0) + (this.state.cash ? parseInt(this.state.cash) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    invest: convertToAngka(text),
                                                                })
                                                            }
                                                        }
                                                        keyboardType='numeric'
                                                        value={this.state.invest ? convertToRupiah(this.state.invest) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Harga Emas"
                                                        keyboardType='numeric'
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (this.state.cash ? parseInt(this.state.cash) : 0) + (this.state.asset ? parseInt(this.state.asset) : 0) +
                                                                    (this.state.debt ? parseInt(this.state.debt) : 0) + (this.state.gold ? parseInt(this.state.gold) : 0) +
                                                                    (this.state.stock ? parseInt(this.state.stock) : 0) + (this.state.invest ? parseInt(this.state.invest) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabEmas)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatMal: jumlah,
                                                                    hartaTotal: total.toString(),
                                                                    hargaEmas: convertToAngka(text),
                                                                    nishabEmas: (85 * convertToAngka(text)).toString()
                                                                })
                                                            }
                                                        }
                                                        value={this.state.hargaEmas ? convertToRupiah(this.state.hargaEmas) : ''} />
                                                </View>
                                                <View>
                                                    <TextField disabled label="NISHAB (85 Gram)"
                                                        value={this.state.nishabEmas ? convertToRupiah(this.state.nishabEmas) : ''} />
                                                </View>
                                                <View>
                                                    <TextField disabled label="Jumlah Harta"
                                                        value={!isNaN(this.state.hartaTotal) ? convertToRupiah(this.state.hartaTotal) : ''} />
                                                </View>
                                                <View>
                                                    <TextField disabled label="Jumlah Zakat Maal"
                                                        value={this.state.jumlahZakatMal ? this.state.jumlahZakatMal : ''} />
                                                </View>
                                                <View style={{ flexDirection: 'row' }} >
                                                    <View style={{ flex: 1 }}>
                                                        <Button style={{ backgroundColor: '#C40018' }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    cash: '',
                                                                    asset: '',
                                                                    debt: '',
                                                                    gold: '',
                                                                    stock: '',
                                                                    invest: '',
                                                                    hargaEmas: '586933',
                                                                    nishabEmas: '49889305',
                                                                    hartaTotal: '',
                                                                    jumlahZakatMal: '',
                                                                    maalState: '',
                                                                })
                                                            }}>
                                                            <Text>Hapus</Text>
                                                        </Button>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <Button block textStyle={{ color: '#87838B' }}
                                                            onPress={() => {
                                                                this.setModalVisible(!this.state.modalVisible);
                                                                this.setState({ amount: convertToAngka(this.state.jumlahZakatMal) })
                                                            }}>
                                                            <Text>Hitung</Text>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </Form>
                                        </Content>
                                    </Tab>
                                    <Tab heading="Profesi">
                                        <Content padder>
                                            <Form>
                                                <View>
                                                    <TextField label="Jumlah Penghasilan Per Bulan"
                                                        keyboardType='numeric'
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.tunjangan ? parseInt(this.state.tunjangan) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabBeras)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    gaji: convertToAngka(text),
                                                                    jumlahZakatProfesi: jumlah,
                                                                    pendapatanTotal: total.toString(),
                                                                })
                                                            }
                                                        }
                                                        value={this.state.gaji ? convertToRupiah(this.state.gaji) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Jumlah Pendapatan Lain Per Bulan"
                                                        keyboardType='numeric'
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (text ? convertToAngka(text) : 0) + (this.state.gaji ? parseInt(this.state.gaji) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabBeras)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    tunjangan: convertToAngka(text),
                                                                    jumlahZakatProfesi: jumlah,
                                                                    pendapatanTotal: total.toString(),
                                                                })
                                                            }
                                                        }
                                                        value={this.state.tunjangan ? convertToRupiah(this.state.tunjangan) : ''} />
                                                </View>
                                                <View>
                                                    <TextField label="Harga Beras"
                                                        keyboardType='numeric'
                                                        onChangeText={
                                                            (text) => {
                                                                let total = (this.state.gaji ? parseInt(this.state.gaji) : 0) + (this.state.tunjangan ? parseInt(this.state.tunjangan) : 0)
                                                                let jumlah = ''
                                                                if (total >= parseInt(this.state.nishabBeras)) {
                                                                    jumlah = convertToRupiah((0.025 * total).toString())
                                                                } else {
                                                                    jumlah = 'Tidak Mencukupi Nishab'
                                                                }

                                                                this.setState({
                                                                    jumlahZakatProfesi: jumlah,
                                                                    pendapatanTotal: total.toString(),
                                                                    hargaBeras: convertToAngka(text),
                                                                    nishabBeras: (520 * convertToAngka(text)).toString()
                                                                })
                                                            }
                                                        }
                                                        value={this.state.hargaBeras ? convertToRupiah(this.state.hargaBeras) : ''} />
                                                </View>
                                                <View>
                                                    <TextField disabled label="Nishab (520 Kg)"
                                                        value={!isNaN(this.state.nishabBeras) ? convertToRupiah(this.state.nishabBeras) : ''} />
                                                </View>
                                                <View>
                                                    <TextField disabled label="Pendapatan Total"
                                                        value={!isNaN(this.state.pendapatanTotal) ? convertToRupiah(this.state.pendapatanTotal) : ''} />
                                                </View>
                                                <View>
                                                    <TextField disabled label="Jumlah Zakat Profesi"
                                                        value={this.state.jumlahZakatProfesi ? this.state.jumlahZakatProfesi : ''} />
                                                </View>
                                                <View style={{ flexDirection: 'row' }} >
                                                    <View style={{ flex: 1 }}>
                                                        <Button style={{ backgroundColor: '#C40018' }}
                                                            onPress={() => {
                                                                this.setState({
                                                                    gaji: '',
                                                                    tunjangan: '',
                                                                    pendapatanTotal: '',
                                                                    hargaBeras: '8900',
                                                                    nishabBeras: '4628000',
                                                                    jumlahZakatProfesi: '',
                                                                    profesiState: ''
                                                                })
                                                            }}>
                                                            <Text>Hapus</Text>
                                                        </Button>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <Button block textStyle={{ color: '#87838B' }}
                                                            onPress={() => {
                                                                this.setModalVisible(!this.state.modalVisible);
                                                                this.setState({ amount: convertToAngka(this.state.jumlahZakatProfesi) })
                                                            }}>
                                                            <Text>Hitung</Text>
                                                        </Button>
                                                    </View>
                                                </View>
                                            </Form>
                                        </Content>
                                    </Tab>
                                </Tabs>
                            </Content>
                        </Container>
                    </Modal>
                    <Content padder style={{ backgroundColor: '#FFFFFF' }}>
                        {campaign.categories_id == 21 &&
                            <View style={{ marginBottom: 5, marginTop: 5 }}>
                                <Button block textStyle={{ color: '#87838B' }}
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible);
                                    }}>
                                    <Text>Kalkulator</Text>
                                </Button>
                            </View>
                        }
                        <Form>
                            <Text>Informasi Donatur</Text>
                            <View>
                                <TextField label="Donasi"
                                    onChangeText={(text) => this.setState({ amount: convertToAngka(text) })}
                                    value={this.state.amount ? convertToRupiah(this.state.amount) : ''}
                                    error={this.state.amount == '' ? 'Text can\'t be empty' : ''} />
                            </View>
                            <View>
                                <TextField label="Fullname"
                                    onChangeText={(text) => this.setState({ full_name: text })}
                                    value={this.state.full_name}
                                    error={this.state.full_name == '' ? 'Text can\'t be empty' : ''} />
                            </View>
                            <View>
                                <TextField label="Email"
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                    error={this.state.email == '' ? 'Text can\'t be empty' : ''} />
                            </View>
                            <View>
                                <TextField label="Pesan"
                                    onChangeText={(text) => this.setState({ comment: text })}
                                    value={this.state.comment}
                                    error={this.state.comment == '' ? 'Text can\'t be empty' : ''} />
                            </View>
                            <Modal
                                animationType={'fade'}
                                transparent={true}
                                visible={this.state.animating} onRequestClose={() => {
                                    console.log('Modal has been closed.');
                                }}>
                                <View style={{
                                    flex: 1,
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <ActivityIndicator size="large" />
                                </View>
                            </Modal>
                            <Text style={{ marginLeft: 10 }}>Tipe Donasi</Text>
                            <CheckBox
                                checked={this.state.donation_type == 'Routine'}
                                title='Routine'
                                onPress={() => this.onDonationChange('Routine')}
                                onIconPress={() => this.onDonationChange('Routine')}
                                containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                            />
                            <CheckBox
                                checked={this.state.donation_type == 'Insidentil'}
                                title='Insidentil'
                                onPress={() => this.onDonationChange('Insidentil')}
                                onIconPress={() => this.onDonationChange('Insidentil')}
                                containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                            />
                            <Text style={{ marginLeft: 10 }}>Donasi Anonim</Text>
                            <CheckBox
                                checked={this.state.anonymous}
                                title={'Donasi sebagai anonim'}
                                onPress={() => this.setState({ anonymous: !this.state.anonymous })}
                                onIconPress={() => this.setState({ anonymous: !this.state.anonymous })}
                                containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                            />
                            <Text style={{ marginLeft: 10 }}>Metode Pembayaran</Text>
                            <Item>
                                <FlatList
                                    extraData={this.state}
                                    keyExtractor={(item, index) => item.id}
                                    data={this.state.banks}
                                    renderItem={({ item }) => {
                                        return <CheckBox
                                            checked={this.state.payment_gateway == item.id}
                                            title={item.label ? item.label : <Left>
                                                <Image source={{ uri: baseUrl + "public/bank/large/" + item.logo }} style={{ height: 70, width: "100%", flex: 1, resizeMode: 'center' }} />
                                            </Left>}
                                            onPress={() => this.onCheckBoxPress(item)}
                                            onIconPress={() => this.onCheckBoxPress(item)}
                                            containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                                        />
                                    }}
                                />
                            </Item>
                        </Form>
                    </Content>
                    <Button block textStyle={{ color: '#87838B' }}
                        onPress={() => this.paymentMethod()}>
                        <Text>Donate</Text>
                    </Button>
                </Container>
            </StyleProvider>
        )
    }
}