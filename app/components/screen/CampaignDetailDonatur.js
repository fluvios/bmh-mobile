import React, { Component } from 'react'
import {
    StyleSheet, ScrollView, ListView,
    View, Image, TouchableHighlight, Linking
} from 'react-native'
import {
    Container, Header, Left, Body, Right, Title,
    Content, Footer, FooterTab, Button, Text, Card,
    CardItem, Thumbnail, Spinner,
} from 'native-base'
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper'
import * as Progress from 'react-native-progress'
import { styles } from "../config/styles"
import { baseUrl } from "../config/variable"

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
        fetch(baseUrl+"api/donations/"+campaign, {
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
                    <Left>
                        <Thumbnail source={{ uri: baseUrl+"public/avatar/default.jpg" }} />
                        <Body>
                            <Text>{rowData.fullname}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text>
                            Rp. {rowData.donation}
                         </Text>
                    </Body>
                </CardItem>
            </Card>
        )
    }

    render() {
        let campaign = (this.state.isLoading) ?
            <Spinner /> :
            <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />

        return campaign
    }
}