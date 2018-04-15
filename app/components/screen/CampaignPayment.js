import React, { Component } from 'react'
import { Platform, AsyncStorage, FlatList, Image, WebView, Modal, TouchableWithoutFeedback } from "react-native"
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
            donation_type: '',
            comment: '',
            anonymous: false,
            modalVisible: false,
            buttonVisible: false,
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
            jumlahZakatFitrah: '0',
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
                        nav.dispatch({
                            type: 'Navigation/NAVIGATE',
                            routeName: 'DeliveryScreen'
                        })
                    } else {
                        console.log(response)
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

                        this.goBack()
                    } else {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
                        })
                    }
                })
                break
            case 'Midtrans':
                this.donate(this.state.campaign_id, form, response => {
                    if (response.success == true) {
                        const token = response.token
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
                    } else {
                        Toast.show({
                            text: response.message,
                            position: 'bottom',
                            buttonText: 'Dismiss'
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

    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }

    calculateMal(state, item) {
        let total = parseInt(this.state.hartaTotal ? this.state.hartaTotal : 0)
        if (this.state.maalState != state && state != 'gold-price') {
            total = total + item
        } else if (this.state.maalState == state && state != 'gold-price') {
            total = item
        } else {
            this.setState({
                hargaEmas: item,
                nishabEmas: (85 * parseInt(item)).toString()
            })
        }
        this.setState({ hartaTotal: total.toString(), maalState: state })
        let jumlah = ''
        if (total >= parseInt(this.state.nishabEmas)) {
            jumlah = convertToRupiah((0.025 * total).toString())
        } else {
            jumlah = 'Tidak Mencukupi Nishab'
        }

        return jumlah
    }

    calculateProfesi(state, item) {
        let total = parseInt(this.state.pendapatanTotal ? this.state.pendapatanTotal : 0)
        if (this.state.profesiState != state && state != 'rice-price') {
            total = total + item
        } else if (this.state.profesiState == state && state != 'rice-price') {
            total = item
        } else {
            this.setState({
                hargaBeras: item,
                nishabBeras: (520 * parseInt(item)).toString()
            })
        }
        this.setState({ pendapatanTotal: total.toString(), profesiState: state })
        let jumlah = ''
        if (total >= parseInt(this.state.nishabBeras)) {
            jumlah = convertToRupiah((0.025 * total).toString())
        } else {
            jumlah = 'Tidak Mencukupi Nishab'
        }

        return jumlah
    }

    render() {
        let campaign = this.props.navigation.state.params.campaign

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Content>
                        <Modal
                            animationType={'slide'}
                            transparent={false}
                            visible={this.state.modalVisible} onRequestClose={() => {
                                console.log('Modal has been closed.');
                            }}>
                            <TouchableWithoutFeedback onPress={() => {  this.setModalVisible(!this.state.modalVisible); }}>
                                <Container>
                                    <Content>
                                        <Tabs>
                                            <Tab heading="Fitrah">
                                                <Form>
                                                    <View>
                                                        <TextField label="Jumlah Anggota Keluarga"
                                                            onChangeText={(text) => this.setState({ jumlahKeluarga: convertToAngka(text), jumlahZakatFitrah: (parseInt(text) * parseInt(this.state.hargaBeras) * 3.5).toString() })}
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
                                                    <Button block textStyle={{ color: '#87838B' }}
                                                        onPress={() => {
                                                            this.setModalVisible(!this.state.modalVisible);
                                                            this.setState({ amount: convertToAngka(this.state.jumlahZakatFitrah) })
                                                        }}>
                                                        <Text>Hitung</Text>
                                                    </Button>
                                                </Form>
                                            </Tab>
                                            <Tab heading="Maal">
                                                <Form>
                                                    <View>
                                                        <TextField label="Uang Kas & Bank"
                                                            onChangeText={(text) => this.setState({
                                                                cash: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('cash', convertToAngka(text))
                                                            })}
                                                            keyboardType='numeric'
                                                            value={this.state.cash ? convertToRupiah(this.state.cash) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Total Asset (yg digunakan tidak perlu dihitung)"
                                                            onChangeText={(text) => this.setState({
                                                                asset: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('asset', convertToAngka(text))
                                                            })}
                                                            keyboardType='numeric'
                                                            value={this.state.asset ? convertToRupiah(this.state.asset) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Piutang Tertagih"
                                                            onChangeText={(text) => this.setState({
                                                                debt: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('debt', convertToAngka(text))
                                                            })}
                                                            keyboardType='numeric'
                                                            value={this.state.debt ? convertToRupiah(this.state.debt) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Emas & Perhiasan lain"
                                                            onChangeText={(text) => this.setState({
                                                                gold: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('gold', convertToAngka(text))
                                                            })}
                                                            keyboardType='numeric'
                                                            value={this.state.gold ? convertToRupiah(this.state.gold) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Saham, obligasi, dana pensiun, asuransi yang diterima"
                                                            onChangeText={(text) => this.setState({
                                                                stock: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('stock', convertToAngka(text))
                                                            })}
                                                            keyboardType='numeric'
                                                            value={this.state.stock ? convertToRupiah(this.state.stock) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Dana yg diinvestasikan"
                                                            onChangeText={(text) => this.setState({
                                                                invest: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('invest', convertToAngka(text))
                                                            })}
                                                            keyboardType='numeric'
                                                            value={this.state.invest ? convertToRupiah(this.state.invest) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Harga Emas"
                                                            keyboardType='numeric'
                                                            onChangeText={(text) => this.setState({
                                                                hargaEmas: convertToAngka(text),
                                                                jumlahZakatMal: this.calculateMal('gold-price', convertToAngka(text))
                                                            })}
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
                                                    <Button block textStyle={{ color: '#87838B' }}
                                                        onPress={() => {
                                                            this.setModalVisible(!this.state.modalVisible);
                                                            this.setState({ amount: convertToAngka(this.state.jumlahZakatMal) })
                                                        }}>
                                                        <Text>Hitung</Text>
                                                    </Button>
                                                </Form>
                                            </Tab>
                                            <Tab heading="Profesi">
                                                <Form>
                                                    <View>
                                                        <TextField label="Jumlah Penghasilan Per Bulan"
                                                            keyboardType='numeric'
                                                            onChangeText={(text) => this.setState({ gaji: convertToAngka(text), jumlahZakatProfesi: this.calculateProfesi('gaji', convertToAngka(text)) })}
                                                            value={this.state.gaji ? convertToRupiah(this.state.gaji) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Jumlah Pendapatan Lain Per Bulan"
                                                            keyboardType='numeric'
                                                            onChangeText={(text) => this.setState({ tunjangan: convertToAngka(text), jumlahZakatProfesi: this.calculateProfesi('tunjangan', convertToAngka(text)) })}
                                                            value={this.state.tunjangan ? convertToRupiah(this.state.tunjangan) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField label="Harga Beras"
                                                            keyboardType='numeric'
                                                            onChangeText={(text) => this.setState({ hargaBeras: convertToAngka(text), jumlahZakatProfesi: this.calculateProfesi('rice-price', convertToAngka(text)) })}
                                                            value={this.state.hargaBeras ? convertToRupiah(this.state.hargaBeras) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField disabled label="Nishab (520 Kg)"
                                                            value={this.state.nishabBeras ? convertToRupiah(this.state.nishabBeras) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField disabled label="Pendapatan Total"
                                                            value={!isNaN(this.state.pendapatanTotal) ? convertToRupiah(this.state.pendapatanTotal) : ''} />
                                                    </View>
                                                    <View>
                                                        <TextField disabled label="Jumlah Zakat Profesi"
                                                            value={this.state.jumlahZakatProfesi ? this.state.jumlahZakatProfesi : ''} />
                                                    </View>
                                                    <Button block textStyle={{ color: '#87838B' }}
                                                        onPress={() => {
                                                            this.setModalVisible(!this.state.modalVisible);
                                                            this.setState({ amount: convertToAngka(this.state.jumlahZakatProfesi) })
                                                        }}>
                                                        <Text>Hitung</Text>
                                                    </Button>
                                                </Form>
                                            </Tab>
                                        </Tabs>
                                    </Content>
                                </Container>
                            </TouchableWithoutFeedback>
                        </Modal>
                        <View style={{ backgroundColor: '#FFFFFF' }}>
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
                                <View style={{ marginTop: 15, marginBottom: 15 }}>
                                    <View style={{ backgroundColor: '#AAAAAA', height: 20, width: '100%' }}></View>
                                </View>
                                <Text style={{ marginLeft: 10 }}>Tipe Donasi</Text>
                                <CheckBox
                                    checked={this.state.donation_type == 'Routine'}
                                    title='Routine'
                                    onPress={() => this.onDonationChange('Routine')}
                                    onIconPress={() => this.onDonationChange('Routine')}
                                    containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                                />
                                <CheckBox
                                    checked={this.state.donation_type == 'Isidentil'}
                                    title='Isidentil'
                                    onPress={() => this.onDonationChange('Isidentil')}
                                    onIconPress={() => this.onDonationChange('Isidentil')}
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
                                            return <ListItem>
                                                <CheckBox
                                                    checked={this.state.payment_gateway == item.id}
                                                    title={item.label ? item.label : <Left>
                                                        <Image source={{ uri: baseUrl + "public/bank/" + item.logo }} style={{ height: 40, width: "100%", flex: 1, resizeMode: 'center' }} />
                                                    </Left>}
                                                    onPress={() => this.onCheckBoxPress(item)}
                                                    onIconPress={() => this.onCheckBoxPress(item)}
                                                    containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                                                />
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