import React, { Component } from 'react';
import { Image } from 'react-native';
import {
    Container, Header, Title, Button, Icon,
    Left, Body, Right, Content, Footer, FooterTab, Text
} from 'native-base';

export default class NewsDetail extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        let campaign = this.props.navigation.state.params.campaign;
        return (
            <Container>
                <Content>
                    <Image source={{ uri: "http://bdv-hostmaster.com/public/campaigns/large/" + campaign.large_image }} style={{ height: 200, width: "100%", flex: 1 }} />
                </Content>
            </Container>
        );
    }
}