import React, { Component } from 'react';
import {
    StyleSheet, ScrollView, ListView,
    View, Image, TouchableHighlight, Linking,
    AsyncStorage
} from 'react-native';
import {
    Container, Header, Left, Body, Right, Title,
    Content, Footer, FooterTab, Button, Text, Card,
    CardItem, Thumbnail, Spinner,
} from 'native-base';
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper';
import Storage from 'react-native-storage';

var campaignArray = [];

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
})

export default class ReportList extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid
        });
        this.state = ({
            dataSource: dataSource.cloneWithRows(campaignArray),
            isLoading: true
        })
    }

    componentDidMount() {
        storage.load({
            key: 'user'
        }).then(ret => this.loadData(ret)).catch(err => {
            console.log(err.message)
        })
    }

    changeStatus(status: string) {
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
            campaignArray = json;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(campaignArray),
                isLoading: false
            })
        }.bind(this));
    }

    getReport(params, callback) {
        fetch("http://galangbersama.com/api/history/" + params, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(json => callback(json))
            .catch((error) => {
                console.error(error);
            })
            .done();
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <Card style={{ flex: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={{ uri: "http://galangbersama.com/public/avatar/default.jpg" }} />
                        <Body>
                            <Text>{rowData.campaign.title}</Text>
                            <Text note>{rowData.donation}</Text>
                            <Text note>{rowData.payment_date}</Text>
                            <Text>{this.changeStatus(rowData.payment_status)}</Text>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        );
    }

    render() {
        let report = (this.state.isLoading) ?
            <Spinner /> :
            <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />

        return report;
    }
}