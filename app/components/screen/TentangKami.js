import React, { Component } from 'react'
import { WebView } from 'react-native'
import { baseUrl } from "../config/variable"

export default class TentangKami extends Component {
    render() {
        return (
            <WebView
                source={{ uri: baseUrl + '/page/tentang-kami' }}
            />
        )
    }
}