import React, { Component } from 'react'
import {
    StyleSheet, ScrollView, ListView,
    View, Image, TouchableHighlight, Linking
} from 'react-native'
import {
    Container, Header, Left, Body, Right, Title,
    Content, Footer, FooterTab, Button, Text, Card,
    CardItem, Thumbnail, Spinner, Fab, Icon
} from 'native-base'
import { convertToRupiah } from '../config/helper'
import * as Progress from 'react-native-progress'
import { styles } from "../config/styles"
import { baseUrl } from "../config/variable"
import Share, { ShareSheet } from 'react-native-share'

var campaignArray = []

export default class CampaignDetailDonatur extends Component {

    constructor(props) {
        super(props)
        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid
        })
        this.state = ({
            dataSource: dataSource.cloneWithRows(campaignArray),
            isLoading: true,
        })
    }

    componentDidMount() {
        this.getDonatur(function (json) {
            campaignArray = json
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(campaignArray),
                isLoading: false
            })
        }.bind(this))
    }

    getDonatur(callback) {
        const campaign = this.props.data.campaign.id
        fetch(baseUrl + "api/donations/" + campaign, {
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

    renderRow(rowData, sectionID, rowID) {
        return (
            <Card style={{ flex: 0 }}>
                <CardItem>
                    {rowData.anonymous != '1' ?
                        <Left>
                            <Thumbnail source={{ uri: baseUrl + "public/avatar/" + rowData.avatar }} />
                            <Body>
                                <Text style={{ color: '#00B7C2' }}>{rowData.fullname}</Text>
                            </Body>
                        </Left> :
                        <Left>
                            <Body>
                                <Text style={{ color: '#00B7C2' }}>Anonim</Text>
                            </Body>
                        </Left>
                    }
                    <Right>
                        <Text>
                            {convertToRupiah(rowData.donation)}
                        </Text>
                    </Right>
                </CardItem>
                {rowData.comment != '' &&
                    <CardItem style={{ backgroundColor: '#ECECEB' }}>
                        <Body>
                            <Text>
                                {rowData.comment}
                            </Text>
                        </Body>
                    </CardItem>
                }
                <CardItem>
                    <Body>
                        <Text>
                            {rowData.payment_date}
                        </Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }

    render() {
        let campaign = this.props.data.campaign
        let shareOptions = {
            title: "Share Campaign",
            message: campaign.title,
            url: baseUrl + 'campaign/' + campaign.id + '/' + campaign.slug,
            subject: "Share Link" //  for email
        }
        let campaignView = (this.state.isLoading) ?
            <Spinner /> :
            <Content>
                <View>
                <Image source={{ uri: baseUrl + "public/campaigns/large/" + campaign.large_image }} resizeMode="cover" style={{ height: 200, width: "100%", flex: 1 }} />
                    <Fab
                        containerStyle={{}}
                        style={{ backgroundColor: '#5067FF', zIndex: 1 }}
                        position="bottomRight"
                        onPress={() => {
                            Share.open(shareOptions);
                        }}>
                        <Icon name="share" />
                    </Fab>
                </View>
                <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />
            </Content>
        return campaignView
    }
}