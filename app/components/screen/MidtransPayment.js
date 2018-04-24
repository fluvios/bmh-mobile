import React, { Component } from 'react'
import { WebView } from 'react-native'
import { baseUrl } from "../config/variable"

export default class MidtransPayment extends Component {
    render() {
        const nav = this.props.navigation
        const html = "<html>" +
            "<head>" +
            "<meta name='viewport' content='width=device-width, initial-scale=1'>" +
            "<script type='text/javascript' src='https://app.midtrans.com/snap/snap.js' data-client-key='Mid-client-41DHiGfxDzZdeBQ8'></script>" +
            "</head>" +
            "<body>" +
            "<script type='text/javascript'>" +
            "snap.pay('" + nav.state.params.token + "');" +
            "</script>" +
            "</body>" +
            "</html>"

        return (
            <WebView
                source={{ html: html }}
            />
        )
    }
}