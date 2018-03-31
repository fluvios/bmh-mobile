import React, { Component } from 'react'
import {
    StyleSheet, ScrollView, ListView, WebView,
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
import { wpUrl, baseUrl } from "../config/variable"
import Wordpress from 'react-native-wordpress'

export default class NewsListMagazine extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            content: '',
            isLoading: true,
        })
    }

    componentDidMount() {
        this.getCampaign(function (json) {
            news = json
            this.setState({
                content: news.guid.rendered,
                isLoading: false
            })
        }.bind(this))
    }

    getCampaign(callback) {
        fetch(wpUrl + "pages/1058", {
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

    render() {
        return (
            <Wordpress url={'bmh.or.id'} />
        )
    }
}