import React, { Component } from 'react'
import { ListView, AsyncStorage, Image, AppState, RefreshControl } from 'react-native'
import Storage from 'react-native-storage'
import {
    Container, Header, Left, Body, Right, Title,
    Content, Footer, FooterTab, Button, Text, Card,
    CardItem, Thumbnail, Spinner, Icon, StyleProvider,
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import { cleanTag, convertToSlug, shortenDescription, convertToRupiah } from '../config/helper'
import * as Progress from 'react-native-progress'
import { styles } from "../config/styles"
import { baseUrl, color } from "../config/variable"
import Moment from 'react-moment'
var campaignArray = []

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: false,
})

var isLogin = false

export default class NewsListMagazine extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Berbagi Kebaikan',
        headerRight: (
            <Button icon transparent onPress={() => { navigation.state.params.handleProfile(navigation) }}>
                {isLogin ? <Icon name='contact' style={{ color: '#f38d1f' }} /> : <Text style={{ color: '#f38d1f' }}>Login</Text>}
            </Button>
        ),
    })

    constructor(props) {
        super(props)

        var dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.guid != r2.guid
        })
        this.state = ({
            dataSource: dataSource.cloneWithRows(campaignArray),
            isLoading: true,
            appState: AppState.currentState,
            refreshing: false
        })
    }

    componentWillMount() {
        AppState.addEventListener('change', this.handleAppStateChange)

        this.getMagazine(function (json) {
            campaignArray = json
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(campaignArray),
                isLoading: false
            })
        }.bind(this))

        this.loadStorage()
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange)
    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            this.forceUpdate()
        }
        this.setState({ appState: nextAppState })
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

    loadStorage() {
        storage.load({
            key: 'user'
        }).then(ret => {
            isLogin = true
            this.props.navigation.setParams({
                handleProfile: this.profile,
                user: ret,
            })
        }).catch(err => {
            console.log(err.message)
            isLogin = false
            this.props.navigation.setParams({
                handleProfile: this.profile,
            })
        })
    }

    onRefresh() {
        this.setState({ refreshing: true })
        this.getMagazine(function (json) {
            campaignArray = json
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(campaignArray),
                isLoading: false
            })

            this.setState({ refreshing: true })
        }.bind(this))
      }

    profile(navigation) {
        if (navigation.state.params.user) {
            navigation.navigate('ProfileScreen', {
                user: navigation.state.params.user,
            })
        } else {
            navigation.navigate('LoginScreen')
        }
    }

    getMagazine(callback) {
        fetch(baseUrl + "api/magazines", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(json => callback(json.data))
            .catch((error) => {
                console.error(error)
            })
            .done()
    }

    renderRow(rowData, sectionID, rowID) {
        const percent = (rowData.total / (rowData.goal ? rowData.goal : 1))
        return (
            <StyleProvider style={getTheme(material)}>
                <Card style={{ flex: 0 }}>
                    <CardItem>
                        <Left>
                            <Text>{rowData.filename}</Text>
                        </Left>
                        <Right>
                            <Button style={{ backgroundColor: '#f38d1f' }}
                                onPress={() => this.props.data.propies.navigation.navigate('ReadScreen', {
                                    magazine: rowData,
                                })}>
                                <Text>Read</Text>
                            </Button>
                        </Right>
                    </CardItem>
                </Card>
            </StyleProvider>
        )
    }

    render() {
        let campaign = (this.state.isLoading) ?
            <Spinner /> :
            <Container>
                <Content>
                    <ListView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)} />
                        }
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        enableEmptySections={true}
                        removeClippedSubviews={false} >
                    </ListView>
                </Content>
            </Container>

        return campaign
    }
}