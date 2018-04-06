import React, { Component } from 'react'
import {
    StyleSheet, ScrollView, ListView,
    View, Image, TouchableHighlight, Linking,
    AsyncStorage
} from 'react-native'
import {
    Container, Header, Left, Body, Right, Title, Icon,
    Content, Footer, FooterTab, Button, Text, Card,
    CardItem, Thumbnail, Spinner,
} from 'native-base'
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper'
import { baseUrl } from "../config/variable"
import Storage from 'react-native-storage'
import MapView from 'react-native-maps'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})

export default class SaldoDeliveryPayment extends Component {

    constructor(props) {
        super(props)
    }

    onRegionChange = (region) => {
        this.setState({ region })
    }

    render() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                position: {
                    longitude: position.coords.longitude, 
                    latitude: position.coords.latitude, 
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            })
        }, (error) => {
            console.log(JSON.stringify(error))
        }, {
                enableHighAccuracy: false,
                timeout: 20000,
                maximumAge: 1000
            })


        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={this.state.position}
                    onRegionChangeComplete={this.onRegionChange}
                    provider={this.props.provider}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    showsUserLocation={true}
                    followsUserLocation={true}
                />
            </View>
        )
    }
}