import React, { Component } from 'react'
import { Image } from 'react-native'
import {
    Container, Content, Card, Icon, Footer,
    CardItem, Body, Text, Fab, View
} from 'native-base'
import { cleanTag } from '../config/helper'
import {
    wpUrl, baseUrl, color,
    TWITTER_ICON, FACEBOOK_ICON, WHATSAPP_ICON,
    GOOGLE_PLUS_ICON, EMAIL_ICON, CLIPBOARD_ICON,
    MORE_ICON, REACT_ICON
} from "../config/variable"
import Share, { ShareSheet, Button } from 'react-native-share'

export default class CampaignUpdateDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            visible: false
        }
    }

    onCancel() {
        console.log("CANCEL")
        this.setState({ visible: false })
    }
    onOpen() {
        console.log("OPEN")
        this.setState({ visible: true })
    }

    render() {
        let campaign = this.props.navigation.state.params.campaign

        let shareOptions = {
            title: campaign.title,
            message: campaign.description,
            url: baseUrl,
            subject: "Share Link" //  for email
        }

        let shareImageBase64 = {
            title: campaign.title,
            message: campaign.description,
            url: REACT_ICON,
            subject: "Share Link" //  for email
        }

        return (
            <Container>
                <Content>
                    <View style={{ flex: 1 }}>
                        {campaign.image != '' &&
                            <Image source={{ uri: baseUrl + "public/campaigns/updates/" + campaign.image }} style={{ height: 200, width: "100%", flex: 1 }} />
                        }
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
                    <Card>
                        <CardItem header>
                            <Body>
                                <Text>{campaign.title}</Text>
                                <Text>{campaign.date}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>{shortenDescription(campaign.description)}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <View>
                    <View>
                        <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}></ShareSheet>
                    </View>
                </View>
            </Container>
        )
    }
}