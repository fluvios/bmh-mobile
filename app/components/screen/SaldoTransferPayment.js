import React, { Component } from 'react'
import {
    Container, Header, Title, Button, ListItem,
    Icon, Card, CardItem, Input, Picker,
    Left, Body, Right, Content, CheckBox,
    Footer, FooterTab, Text, Form, Item, H1, H3, Toast,
} from 'native-base'
import _ from "lodash"
import ImagePicker from 'react-native-image-picker'

export default class SaldoTransferPayment extends Component {

    constructor(props) {
        super(props);

        this.state = {
            photo: undefined,
            showToast: false,
            banks: [],
            bank_id: 0,
        }

        this.bankList();
    }

    onBankChange(value) {
        this.setState({
            bank_id: value
        });
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 1000,
            maxHeight: 1000,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                // let images = this.state.images;
                // images.push(response);
                this.setState({ photo: response });
            }
        });
    }

    doUpload() {
        let formData = new FormData()
        formData.append('photo', {
            uri: this.state.photo.uri,
            type: this.state.photo.type,
            name: this.state.photo.fileName
        })
        formData.append('bank_id', this.state.bank_id)
        const depositId = this.props.navigation.state.params.depositId
        this.transfer(depositId, formData, response => {
            Toast.show({
                text: response.status,
                position: 'bottom',
                buttonText: 'Dismiss'
            })
        })
    }

    transfer(params, data, callback) {
        fetch("http://galangbersama.com/api/topup/transfer/" + params, {
            method: "POST",
            body: data,
        })
            .then((response) => response.json())
            .then(json => callback(json))
            .catch((error) => {
                console.error(error);
            })
            .done();
    }

    bankList() {
        fetch('http://galangbersama.com/api/bank', {
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
        const amount = this.props.navigation.state.params.amount
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
                                    Harap ditransfer kurang dari 24 jam
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <H1>
                        Bank Tujuan
                    </H1>
                    <Picker
                        mode="dropdown"
                        selectedValue={this.state.bank_id}
                        onValueChange={this.onBankChange.bind(this)}>
                        <Item key='0' label='Pilih bank tujuan' value='0' />
                        {
                            this.state.banks.map((bank, i) =>
                                <Item key={i} label={bank.name + " (" + bank.account_number + ")"} value={bank.id} />
                            )
                        }
                    </Picker>
                    <Card>
                        <CardItem>
                            <Body>
                                <CardItem header>
                                    <Text>Tata Cara Transfer</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>
                                            1. Transfer pembayaran ke salah satu rekening yang anda pilih
                                        </Text>
                                        <Text>
                                            2. Unggah bukti pembayaran dibawah ini
                                        </Text>
                                        <Text>
                                            3. Batas waktu unggah adalah 24 jam
                                        </Text>
                                    </Body>
                                </CardItem>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <CardItem header>
                                    <Text>Unggah Bukti Pembayaran</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Button block textStyle={{ color: '#87838B' }}
                                            onPress={this.selectPhotoTapped.bind(this)}>
                                            <Text>Tambah Bukti</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Button block textStyle={{ color: '#87838B' }}
                                            onPress={this.doUpload.bind(this)}>
                                            <Text>Unggah Bukti</Text>
                                        </Button>
                                    </Body>
                                </CardItem>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}