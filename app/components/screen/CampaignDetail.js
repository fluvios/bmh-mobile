import React, { Component } from 'react'
import { Image, AsyncStorage } from 'react-native'
import {
    Container, Header, Title, Icon, Tabs, Tab, View, Fab, Button,
    Left, Body, Right, Content, Footer, FooterTab, Text, StyleProvider
} from 'native-base'
import CampaignDetailText from "./CampaignDetailText"
import CampaignDetailStory from "./CampaignDetailStory"
import CampaignDetailDonatur from "./CampaignDetailDonatur"
import CampaignDetailInfo from "./CampaignDetailInfo"
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { cleanTag } from '../config/helper'
import {
    baseUrl, color,
    TWITTER_ICON, FACEBOOK_ICON, WHATSAPP_ICON,
    GOOGLE_PLUS_ICON, EMAIL_ICON, CLIPBOARD_ICON,
    MORE_ICON, REACT_ICON
} from "../config/variable"
import Share, { ShareSheet } from 'react-native-share'
import Storage from 'react-native-storage'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

export default class CampaignDetail extends Component {

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

    donate(item) {
        storage.load({
            key: 'user'
        }).then(ret => {
            this.props.navigation.navigate('DonateScreen', {
                campaign: item,
                user: ret
            })
        }).catch(err => {
            // console.error(err.message)
            switch (err.name) {
                case 'NotFoundError':
                    this.props.navigation.navigate('LoginScreen', {
                        goto: 'DonateScreen',
                        item: item
                    })
                    break
                case 'ExpiredError':
                    storage.remove({
                        key: 'user'
                    })
                    this.props.navigation.navigate('LoginScreen', {
                        goto: 'DonateScreen',
                        item: item
                    })
                    break
            }
        })
    }

    render() {
        let campaign = this.props.navigation.state.params.campaign

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        <Tabs>
                            <Tab heading="Detail">
                                <CampaignDetailText data={{ campaign }} />
                            </Tab>
                            <Tab heading="Info">
                                <CampaignDetailInfo data={{ campaign }} />
                            </Tab>
                            <Tab heading="Updates">
                                <CampaignDetailStory data={{ campaign }} />
                            </Tab>
                            <Tab heading="Donatur">
                                <CampaignDetailDonatur data={{ campaign }} />
                            </Tab>
                        </Tabs>
                    </View>
                    <Button full style={{ backgroundColor: '#f38d1f' }}
                        onPress={() => this.donate(campaign)}>
                        <Text>Donasi Sekarang</Text>
                    </Button>
                    <View>
                        <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}></ShareSheet>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}