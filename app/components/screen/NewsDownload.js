import React, { Component } from 'react'
import { WebView } from 'react-native'
import { baseUrl } from "../config/variable"

export default class NewsDownload extends Component {
    render() {
        const nav = this.props.navigation

        return (
            <WebView
                source={{ uri: nav.state.params.url }}
            />
        )
    }
}