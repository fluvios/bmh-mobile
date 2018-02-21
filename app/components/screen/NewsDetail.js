import React, { Component } from 'react';
import { Image } from 'react-native';
import {
    Container, Content, Card, 
    CardItem, Body, Text,
} from 'native-base';
import { cleanTag } from '../config/helper';
import { wpUrl, baseUrl } from "../config/variable";

export default class NewsDetail extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let news = this.props.navigation.state.params.campaign;
        return (
            <Container>
                <Content>
                    <Image source={{ uri: news.better_featured_image.source_url }} style={{ height: 200, width: "100%", flex: 1 }} />
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>
                                    { cleanTag(news.content.rendered) }
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}