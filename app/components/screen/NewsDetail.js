import React, { Component } from 'react'
import { Image } from 'react-native'
import {
    Container, Content, Card, Icon, Footer,
    CardItem, Body, Text, Fab, View
} from 'native-base'
import { cleanTag } from '../config/helper'
import { wpUrl, baseUrl } from "../config/variable"

export default class NewsDetail extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let news = this.props.navigation.state.params.campaign
        return (
            <Container>
                <Content>
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: news.better_featured_image.source_url }} style={{ height: 200, width: "100%", flex: 1 }} />
                        <Fab
                            containerStyle={{}}
                            style={{ backgroundColor: '#5067FF', zIndex: 1 }}
                            position="bottomRight">
                            <Icon name="share" />
                        </Fab>
                    </View>
                    <Card>
                        <CardItem header>
                            <Text style={{ fontWeight: 'bold' }}>{news.title.rendered}</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text>
                                    {cleanTag(news.content.rendered)}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        )
    }
}