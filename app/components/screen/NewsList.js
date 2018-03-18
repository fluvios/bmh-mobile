import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import Storage from 'react-native-storage'
import {
    Container, Header, Title, Button, Icon, Tabs, Tab,
    Left, Body, Right, View, Footer, FooterTab, Text, StyleProvider
} from 'native-base'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import NewsListBerita from "./NewsListBerita"
import NewsListInspirasi from "./NewsListInspirasi"
import NewsListKonsultasi from "./NewsListKonsultasi"
import NewsListMagazine from "./NewsListMagazine"

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})

var isLogin = false

export default class NewsList extends Component {

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
    }

    loadStorage() {
        storage.load({
            key: 'user'
        }).then(ret => {
            isLogin = true
            this.props.navigation.setParams({
                handleProfile: this.profile,
                user: ret
            })
        }).catch(err => {
            console.log(err.message)
            this.props.navigation.setParams({
                handleProfile: this.profile,
            })
        })
    }

    componentWillMount() {
        this.loadStorage()
    }

    profile(navigation) {
        if (navigation.state.params.user) {
            navigation.navigate('ProfileScreen', {
                user: navigation.state.params.user
            })
        } else {
            navigation.navigate('LoginScreen')
            this.props.navigation.setParams({
                handleProfile: this.profile,
            })
        }
    }

    render() {
        const propies = this.props
        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <View style={{ flex: 1 }}>
                        <Tabs>
                            <Tab heading="Berita" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                                <NewsListBerita data={{ propies }} />
                            </Tab>
                            <Tab heading="Inspirasi" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                                <NewsListInspirasi data={{ propies }} />
                            </Tab>
                            <Tab heading="Konsultasi" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                                <NewsListKonsultasi data={{ propies }} />
                            </Tab>
                            <Tab heading="I-Magazine" textStyle={{ fontSize: 12 }} activeTextStyle={{ fontSize: 11 }}>
                                <NewsListMagazine data={{ propies }} />
                            </Tab>
                        </Tabs>
                    </View>
                </Container>
            </StyleProvider>
        )
    }
}