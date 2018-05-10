import React, { Component } from 'react'
import { View, AsyncStorage, Image, Text, WebView, StyleSheet, } from 'react-native'
import {
    Container, Item, Input, Header, Body, Content,
    Title, Button, Label, Spinner, Toast, H1, Form,
} from 'native-base'
import Storage from 'react-native-storage'
import { baseUrl } from "../config/variable"
import { styles } from "../config/styles"
import PasswordInputText from 'react-native-hide-show-password-input'
import { TextField } from 'react-native-material-textfield'
import { NavigationActions } from 'react-navigation'
import MapView from 'react-native-maps'

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

const maps = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
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

export default class EditProfileAddress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showToast: false,
            isPinned: false,
            fullhomeaddress: '',
            homepostalcode: '',
            homestate: '',
            latitude: 0,
            longitude: 0,
            user_id: '',
            position: {
                longitude: 0,
                latitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            }
        }
    }

    updateAccount(params, data, callback) {
        fetch(baseUrl + "api/account/" + params + "/address", {
            method: "POST",
            body: JSON.stringify(data),
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

    getAccount(params, callback) {
        fetch(baseUrl + "api/account/" + params + "/refresh", {
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

    editAccount(data) {
        const nav = this.props.navigation
        this.updateAccount(data.user_id, data, (response) => {
            if (response.success === true) {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'ProfileScreen', params: { user: response.response } })],
                })
                nav.dispatch(resetAction)
                Toast.show({
                    text: 'Edit Alamat Success',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            } else {
                Toast.show({
                    text: 'Edit Alamat Failed',
                    position: 'bottom',
                    buttonText: 'Dismiss'
                })
            }
        })
    }

    componentDidMount() {
        const nav = this.props.navigation
        storage.load({
            key: 'user'
        }).then(ret => {
            this.getAccount(ret.id, response => {
                this.setState({
                    user_id: response.id,
                    fullhomeaddress: response.address.alamat,
                    homepostalcode: response.address.kodepos.toString(),
                    homestate: response.address.kabupaten,
                    latitude: parseFloat(response.address.latitude),
                    longitude: parseFloat(response.address.longitude),
                    position: {
                        latitude: parseFloat(response.address.latitude),
                        longitude: parseFloat(response.address.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                    isPinned: true
                })
            })
        }).catch(err => {
            console.log(err.message)
        })
    }

    onRegionChange = (position) => {
        this.setState({ position })
    }

    onMapClick = (event) => {
        this.setState({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude
        })
    }

    render() {
        const nav = this.props.navigation
        const apiKey = "AIzaSyAGT02O_4boNQLw-cg0nYQ1F_-wsw7C1qU"

        if (!this.state.isPinned) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({
                    position: {
                        longitude: position.coords.longitude ? position.coords.longitude : -6.121435,
                        latitude: position.coords.latitude ? position.coords.latitude : 106.774124,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    },
                })
            }, (error) => {
                console.log(JSON.stringify(error))
            }, {
                    enableHighAccuracy: false,
                    timeout: 20000,
                    maximumAge: 1000
                })
        }
        return (
            <Container>
                <Content padder>
                    <Form>
                        <View>
                            <TextField
                                label='Kota/Kabupaten'
                                value={this.state.homestate}
                                onChangeText={(homestate) => this.setState({ homestate })}
                            />
                            <TextField
                                label='Kode Pos'
                                value={this.state.homepostalcode}
                                onChangeText={(homepostalcode) => this.setState({ homepostalcode })}
                            />
                            <TextField
                                label='Alamat'
                                value={this.state.fullhomeaddress}
                                onChangeText={(fullhomeaddress) => this.setState({ fullhomeaddress })}
                            />
                            <View style={maps.container}>
                                <MapView
                                    style={maps.map}
                                    initialRegion={this.state.position}
                                    onRegionChangeComplete={this.onRegionChange}
                                    onPress={this.onMapClick}
                                    provider={this.props.provider}
                                    zoomEnabled={true}
                                    pitchEnabled={true}
                                    showsUserLocation={true}
                                    followsUserLocation={false}
                                >
                                    <MapView.Marker coordinate={
                                        {
                                            latitude: this.state.latitude ? this.state.latitude : this.state.position.latitude,
                                            longitude: this.state.longitude ? this.state.longitude : this.state.position.longitude
                                        }
                                    }
                                    />
                                </MapView>
                            </View>
                        </View>

                        <View style={styles.deviderColumn}>
                            <Button block style={{ backgroundColor: '#f38d1f' }} onPress={() => this.editAccount(this.state)}>
                                <Text style={styles.buttonText}>Edit Alamat</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </Container>
        )
    }
}