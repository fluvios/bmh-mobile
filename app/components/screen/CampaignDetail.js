import React, { Component } from 'react'
import { Image, AsyncStorage } from 'react-native'
import {
    Container, Header, Title, Icon, Tabs, Tab, View, Fab,
    Left, Body, Right, Content, Footer, FooterTab, Text, StyleProvider
} from 'native-base'
import CampaignDetailText from "./CampaignDetailText"
import CampaignDetailStory from "./CampaignDetailStory"
import CampaignDetailDonatur from "./CampaignDetailDonatur"
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { cleanTag } from '../config/helper'
import {
    baseUrl, color,
    TWITTER_ICON, FACEBOOK_ICON, WHATSAPP_ICON,
    GOOGLE_PLUS_ICON, EMAIL_ICON, CLIPBOARD_ICON,
    MORE_ICON, REACT_ICON
} from "../config/variable"
import Share, { ShareSheet, Button } from 'react-native-share'
import Storage from 'react-native-storage'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
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
                    this.props.navigation.navigate('LoginScreen')
                    break
                case 'ExpiredError':
                    storage.remove({
                        key: 'user'
                    })
                    this.props.navigation.navigate('LoginScreen')
                    break
            }
        })
    }

    render() {
        let campaign = this.props.navigation.state.params.campaign
        let shareOptions = {
            title: campaign.title,
            message: cleanTag(campaign.description),
            url: "http://bdv-hostmaster.com/",
            subject: "Share Link" //  for email
        }

        let shareImageBase64 = {
            title: campaign.title,
            message: cleanTag(campaign.description),
            url: REACT_ICON,
            subject: "Share Link" //  for email
        }

        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Content>
                        <View style={{ flex: 1 }}>
                            <Image source={{ uri: baseUrl + "public/campaigns/large/" + campaign.large_image }} style={{ height: 200, width: "100%", flex: 1 }} />
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
                        <Tabs>
                            <Tab heading="Detail">
                                <CampaignDetailText data={{ campaign }} />
                            </Tab>
                            <Tab heading="Updates">
                                <CampaignDetailStory data={{ campaign }} />
                            </Tab>
                            <Tab heading="Donatur">
                                <CampaignDetailDonatur data={{ campaign }} />
                            </Tab>
                        </Tabs>
                    </Content>
                    <Button full style={{ backgroundColor: color.lightColor }}
                        onPress={() => this.donate(campaign)}>
                        <Text>Donate Now</Text>
                    </Button>
                    <View>
                        <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                            <Button iconSrc={{ uri: TWITTER_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        Share.shareSingle(Object.assign(shareOptions, {
                                            "social": "twitter"
                                        }));
                                    }, 300);
                                }}>Twitter</Button>
                            <Button iconSrc={{ uri: FACEBOOK_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        Share.shareSingle(Object.assign(shareOptions, {
                                            "social": "facebook"
                                        }));
                                    }, 300);
                                }}>Facebook</Button>
                            <Button iconSrc={{ uri: WHATSAPP_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        Share.shareSingle(Object.assign(shareOptions, {
                                            "social": "whatsapp"
                                        }));
                                    }, 300);
                                }}>Whatsapp</Button>
                            <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        Share.shareSingle(Object.assign(shareOptions, {
                                            "social": "googleplus"
                                        }));
                                    }, 300);
                                }}>Google +</Button>
                            <Button iconSrc={{ uri: EMAIL_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        Share.shareSingle(Object.assign(shareOptions, {
                                            "social": "email"
                                        }));
                                    }, 300);
                                }}>Email</Button>
                            <Button
                                iconSrc={{ uri: CLIPBOARD_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        if (typeof shareOptions["url"] !== undefined) {
                                            Clipboard.setString(shareOptions["url"]);
                                            if (Platform.OS === "android") {
                                                ToastAndroid.show('Link copiado al portapapeles', ToastAndroid.SHORT);
                                            } else if (Platform.OS === "ios") {
                                                AlertIOS.alert('Link copiado al portapapeles');
                                            }
                                        }
                                    }, 300);
                                }}>Copy Link</Button>
                            <Button iconSrc={{ uri: MORE_ICON }}
                                onPress={() => {
                                    this.onCancel();
                                    setTimeout(() => {
                                        Share.open(shareOptions)
                                    }, 300);
                                }}>More</Button>
                        </ShareSheet>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}