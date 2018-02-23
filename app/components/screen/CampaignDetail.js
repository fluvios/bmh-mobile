import React, { Component } from 'react'
import { Image, AsyncStorage } from 'react-native'
import {
    Container, Header, Title, Button, Icon, Tabs, Tab,
    Left, Body, Right, Content, Footer, FooterTab, Text
} from 'native-base'
import CampaignDetailText from "./CampaignDetailText"
import CampaignDetailStory from "./CampaignDetailStory"
import CampaignDetailDonatur from "./CampaignDetailDonatur"
import { baseUrl } from "../config/variable"
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
        return (
            <Container>
                <Content>
                    <Image source={{ uri: baseUrl + "public/campaigns/large/" + campaign.large_image }} style={{ height: 200, width: "100%", flex: 1 }} />
                    {/* <CampaignTabs /> */}
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
                <Button full textStyle={{ color: '#87838B' }}
                    onPress={() => this.donate(campaign)}>
                    <Text>Donate</Text>
                </Button>
            </Container>
        )
    }
}