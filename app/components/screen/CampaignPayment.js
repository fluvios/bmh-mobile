import React, { Component } from 'react'
import { Platform, AsyncStorage, FlatList, Image, WebView, Modal } from "react-native"
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
                { id: 'Delivery', name: 'Jemput Cash' },
                { id: 'Midtrans', name: 'Multipayment' },
                { id: 'Deposit', name: 'Potong Saldo' },
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
            hartaTotal: '0',
            jumlahZakatMal: '0',
            // Zakat Profesi
            gaji: '',
            tunjangan: '',
            pendapatanTotal: '0',
            nishabBeras: '4628000',
            jumlahZakatProfesi: '0'
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
        this.setState({ modalVisible: visible });
    }

    calculateMal() {
        let total = parseInt(this.state.cash) + parseInt(this.state.asset) + parseInt(this.state.debt) + parseInt(this.state.gold) + parseInt(this.state.stock) + parseInt(this.state.invest)
        this.setState({ hartaTotal: total.toString() })
        let jumlah = ''
        if (total >= this.state.nishabEmas) {
            jumlah = total.toString()
        } else {
            jumlah = 'Tidak Mencukupi Nishab'
        }

        return jumlah
    }

    calculateProfesi() {
        let total = parseInt(this.state.gaji) + parseInt(this.state.tunjangan)
        this.setState({ pendapatanTotal: total.toString() })
        let jumlah = ''
        if (total >= this.state.nishabBeras) {
            jumlah = total.toString()
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
                            <Container>
                                <Content>
                                    <Tabs>
                                        <Tab heading="Fitrah">
                                            <Form>
                                                <Item>
                                                    <Input placeholder="Jumlah Anggota Keluarga"
                                                        onChangeText={(text) => this.setState({ jumlahKeluarga: text, jumlahZakatFitrah: (parseInt(text) * parseInt(this.state.hargaBeras)).toString() })}
                                                        value={this.state.jumlahKeluarga} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Harga Beras"
                                                        value={this.state.hargaBeras} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Jumlah Zakat Fitrah"
                                                        value={!isNaN(this.state.jumlahZakatFitrah) ? this.state.jumlahZakatFitrah : '0'} />
                                                </Item>
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
                                                <Item>
                                                    <Input placeholder="Uang Kas & Bank"
                                                        onChangeText={(text) => this.setState({
                                                            cash: text,
                                                            jumlahZakatMal: this.calculateMal()
                                                        })}
                                                        value={this.state.cash} />
                                                </Item>
                                                <Item>
                                                    <Input placeholder="Total Asset (yg digunakan tidak perlu dihitung)"
                                                        onChangeText={(text) => this.setState({
                                                            asset: text,
                                                            jumlahZakatMal: this.calculateMal()
                                                        })}
                                                        value={this.state.asset} />
                                                </Item>
                                                <Item>
                                                    <Input placeholder="Piutang Tertagih"
                                                        onChangeText={(text) => this.setState({
                                                            debt: text,
                                                            jumlahZakatMal: this.calculateMal()
                                                        })}
                                                        value={this.state.debt} />
                                                </Item>
                                                <Item>
                                                    <Input placeholder="Emas & Perhiasan lain"
                                                        onChangeText={(text) => this.setState({
                                                            gold: text,
                                                            jumlahZakatMal: this.calculateMal()
                                                        })}
                                                        value={this.state.gold} />
                                                </Item>
                                                <Item>
                                                    <Input placeholder="Saham, obligasi, dana pensiun, asuransi yang diterima"
                                                        onChangeText={(text) => this.setState({
                                                            stock: text,
                                                            jumlahZakatMal: this.calculateMal()
                                                        })}
                                                        value={this.state.stock} />
                                                </Item>
                                                <Item>
                                                    <Input placeholder="Dana yg diinvestasikan"
                                                        onChangeText={(text) => this.setState({
                                                            invest: text,
                                                            jumlahZakatMal: this.calculateMal()
                                                        })}
                                                        value={this.state.invest} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Harga Emas"
                                                        value={this.state.hargaEmas} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="NISHAB (85 Gram)"
                                                        value={this.state.nishabEmas} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Jumlah Harta"
                                                        value={!isNaN(this.state.hartaTotal) ? this.state.hartaTotal : '0'} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Jumlah Zakat Maal"
                                                        value={!isNaN(this.state.jumlahZakatMal) ? this.state.jumlahZakatMal : '0'} />
                                                </Item>
                                                <Button block textStyle={{ color: '#87838B' }}
                                                    onPress={() => {
                                                        this.setModalVisible(!this.state.modalVisible);
                                                        this.setState({ amount: convertToAngka(this.state.jumlahZakatFitrah) })
                                                    }}>
                                                    <Text>Hitung</Text>
                                                </Button>
                                            </Form>
                                        </Tab>
                                        <Tab heading="Profesi">
                                            <Form>
                                                <Item>
                                                    <Input placeholder="Jumlah Penghasilan Per Bulan"
                                                        onChangeText={(text) => this.setState({ gaji: text, jumlahZakatProfesi: this.calculateProfesi() })}
                                                        value={this.state.gaji} />
                                                </Item>
                                                <Item>
                                                    <Input placeholder="Jumlah Pendapatan Lain Per Bulan"
                                                        onChangeText={(text) => this.setState({ tunjangan: text, jumlahZakatProfesi: this.calculateProfesi() })}
                                                        value={this.state.tunjangan} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Harga Beras"
                                                        value={this.state.hargaBeras} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Nishab (520 Kg)"
                                                        value={this.state.nishabBeras} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Pendapatan Total"
                                                        value={!isNaN(this.state.pendapatanTotal) ? this.state.pendapatanTotal : '0'} />
                                                </Item>
                                                <Item>
                                                    <Input disabled placeholder="Jumlah Zakat Profesi"
                                                        value={!isNaN(this.state.jumlahZakatProfesi) ? this.state.jumlahZakatProfesi : '0'} />
                                                </Item>
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
                        </Modal>
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            <Form>
                                <Text>Informasi Donatur</Text>
                                <Item>
                                    <Input placeholder="Donasi"
                                        onChangeText={(text) => this.setState({ amount: convertToAngka(text) })}
                                        value={this.state.amount ? convertToRupiah(this.state.amount) : ''} />
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
                                                    title={item.name}
                                                    onPress={() => this.onCheckBoxPress(item)}
                                                    onIconPress={() => this.onCheckBoxPress(item)}
                                                    containerStyle={{ flex: 1, backgroundColor: '#FFF', borderWidth: 0 }}
                                                />
                                                <Right>
                                                    <Image source={{ uri: baseUrl + "public/bank/" + item.logo }} style={{ height: 50, width: "100%", flex: 1, resizeMode: 'center' }} />
                                                </Right>
                                            </ListItem>
                                        }}
                                    />
                                </Item>
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