import React, { Component } from 'react'
import { WebView } from 'react-native'
import { baseUrl } from "../config/variable"

export default class NewsListMagazine extends Component {
    render() {
        return (
            <WebView
                source={{ uri: "http://www.bmh.or.id/download-majalah-mulia/" }}
            />
        )
    }
}