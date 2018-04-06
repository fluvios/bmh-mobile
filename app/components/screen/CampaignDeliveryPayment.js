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
import MapViewDirections from 'react-native-maps-directions'

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

export default class CampignDeliveryPayment extends Component {

    constructor(props) {
        super(props)

        this.state = ({
            position: {
                longitude: 0,
                latitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            }
        })
    }

    onRegionChange = (position) => {
        this.setState({ position })
    }

    render() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                position: {
                    longitude: position.coords.longitude ? position.coords.longitude : -6.121435,
                    latitude: position.coords.latitude ? position.coords.latitude : 106.774124,
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

        let coordinates = [
            {
                latitude: this.state.position.latitude,
                longitude: this.state.position.longitude,
            },
            {
                latitude: -6.266197,
                longitude: 106.8372333,
            }
        ]
        const apiKey = "AIzaSyAGT02O_4boNQLw-cg0nYQ1F_-wsw7C1qU"
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
                >
                    <MapView.Marker coordinate={coordinates[1]} />
                    <MapViewDirections
                        origin={coordinates[0]}
                        destination={coordinates[1]}
                        apikey={apiKey}
                        strokeWidth={3}
                        strokeColor="red"
                    />
                </MapView>
            </View>
        )
    }
}