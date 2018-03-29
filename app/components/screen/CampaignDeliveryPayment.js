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
    enableCache: true,
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

export default class CampaignDeliveryPayment extends Component {

    constructor(props) {
        super(props)

        this.state = ({
            region: {
                latitude: -6.121435,
                longitude: 106.774124,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        })
    }

    onRegionChange = (region) => {
        this.setState({ region })
    }

    render() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({ position: { longitude: position.longitude, latitude: position.latitude } })
        }, (error) => {
            alert(JSON.stringify(error))
        }, {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000
            })

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    region={this.state.position}
                    onRegionChangeComplete={this.onRegionChange}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsCompass={true}
                    showsBuildings={true}
                    showsTraffic={true}
                    showsIndoors={true}
                />
            </View>
        )
    }
}