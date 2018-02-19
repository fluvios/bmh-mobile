import React, { Component } from 'react';
import { Image } from 'react-native';
import {
    Container, Header, Title, Button, Icon, Tabs, Tab,
    Left, Body, Right, Content, Footer, FooterTab, Text
} from 'native-base';
import CampaignDetailText from "./CampaignDetailText";
import CampaignDetailStory from "./CampaignDetailStory";
import CampaignDetailDonatur from "./CampaignDetailDonatur";

export default class CampaignDetail extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let campaign = this.props.navigation.state.params.campaign;
        return (
            <Container>
                <Content>
                    <Image source={{ uri: "http://galangbersama.com/public/campaigns/large/" + campaign.large_image }} style={{ height: 200, width: "100%", flex: 1 }} />
                    {/* <CampaignTabs /> */}
                    <Tabs>
                        <Tab heading="Detail">
                            <CampaignDetailText data={{ campaign }} />
                        </Tab>
                        <Tab heading="Story">
                            <CampaignDetailStory data={{ campaign }} />
                        </Tab>
                        <Tab heading="Donatur">
                            <CampaignDetailDonatur data={{ campaign }} />
                        </Tab>
                    </Tabs>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full textStyle={{ color: '#87838B' }}
                            onPress={() => this.props.navigation.navigate('DonateScreen', {
                                campaign: campaign,
                            })}>
                            <Text>Donate</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}