import React, { Component } from 'react'
import {
    StyleSheet, ScrollView, ListView,
    View, Image, TouchableHighlight, Linking,
    AsyncStorage
} from 'react-native'
import {
    Container, Header, Left, Body, Right, Title,
    Content, Footer, FooterTab, Button, Text, Card,
    CardItem, Thumbnail, Spinner, Toast, Icon,
} from 'native-base'
import { cleanTag, convertToSlug, shortenDescription, convertToRupiah } from '../config/helper'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"

var campaignArray = []

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

export default class SaldoReportList extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Berbagi Kebaikan',
        headerRight: (
            <Button icon transparent onPress={() => { navigation.state.params.handleProfile(navigation) }}>
                <Icon name='contact' />
            </Button>
        ),
    })

    constructor(props) {
        super(props)
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid
        })
        this.state = ({
            dataSource: dataSource.cloneWithRows(campaignArray),
            isLoading: true,
            showToast: false
        })
    }

    componentDidMount() {
        storage.load({
            key: 'user'
        }).then(ret => this.loadData(ret)).catch(err => {
            console.log(err.message)
            // Toast.show({
            //     text: "Login untuk melihat data anda",
            //     position: 'bottom',
            //     buttonText: 'Dismiss'
            // })
            this.setState({
                isLoading: false
            })
            // this.props.navigation.setParams({
            //     handleProfile: this.profile,
            // })
        })
    }

    changeStatus(status) {
        let translate
        switch (status) {
            case 'paid':
                translate = 'Sudah dibayarkan'
                break
            case 'unpaid':
                translate = 'Belum dibayarkan'
                break
            case 'expired':
                translate = 'Belum dibayarkan'
                break
            case 'denied':
                translate = 'Pembayaran ditolak'
                break
        }

        return translate
    }

    loadData(data) {
        this.getReport(data.id, function (json) {
            campaignArray = json
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(campaignArray),
                isLoading: false
            })
        }.bind(this))

        this.props.navigation.setParams({
            handleProfile: this.profile,
            user: data
        })
    }

    getReport(params, callback) {
        fetch(baseUrl + "api/history/saldo/" + params, {
            method: "GET",
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

    profile(navigation) {
        if (navigation.state.params.user) {
            navigation.navigate('ProfileScreen', {
                user: navigation.state.params.user
            })
        } else {
            navigation.navigate('LoginScreen')
            this.props.navigation.setParams({
                handleProfile: this.profile,
            })
        }
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: baseUrl + "public/avatar/default.jpg" }} />
                        <Body>
                            <Text note>{convertToRupiah((rowData.amount-rowData.amount_key))}</Text>
                            <Text note>{rowData.payment_date}</Text>
                            <Text>{this.changeStatus(rowData.payment_status)}</Text>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        )
    }

    render() {
        let report = (this.state.isLoading) ?
            <Spinner /> :
            <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />

        return report
    }
}