import React from 'react'
import { TabNavigator, StackNavigator, TabBarBottom } from "react-navigation"
import Ionicons from 'react-native-vector-icons/Ionicons'

import CampaignList from "../screen/CampaignList"
import CampaignDetail from "../screen/CampaignDetail"
import CampaignUpdateDetail from "../screen/CampaignUpdateDetail"
import DepositoList from "../screen/DepositoList"
import NewsList from "../screen/NewsList"
import NewsDetail from "../screen/NewsDetail"
import CampaignDetailDonatur from '../screen/CampaignDetailDonatur'
import CampaignDetailStory from '../screen/CampaignDetailStory'
import CampaignDetailText from '../screen/CampaignDetailText'
import CampaignPayment from "../screen/CampaignPayment"
import CampaignTransferPayment from "../screen/CampaignTransferPayment"
import CampaignDeliveryPayment from "../screen/CampaignDeliveryPayment"
import SaldoPayment from "../screen/SaldoPayment"
import SaldoTransferPayment from "../screen/SaldoTransferPayment"
import SaldoDeliveryPayment from "../screen/SaldoDeliveryPayment"
import ReportList from '../screen/ReportList'
import Login from "../screen/Login"
import Profile from "../screen/Profile"
import { styles } from "./styles"
import { color } from "./variable"

export const CampaignStack = StackNavigator({
    ListScreen: {
        screen: CampaignList,
    },
    ProfileScreen: {
        screen: Profile,
    },
    DetailScreen: {
        screen: CampaignDetail,
        navigationOptions: {
            title: 'Campaign',
            tabBarVisible: false,
        }
    },
    DetailUpdateScreen: {
        screen: CampaignUpdateDetail,
        navigationOptions: {
            title: 'Update',
            tabBarVisible: false,
        }
    },
    DonateScreen: {
        screen: CampaignPayment,
        navigationOptions: {
            title: 'Donate',
            tabBarVisible: false,
        }
    },
    LoginScreen: {
        screen: Login,
        navigationOptions: {
            tabBarVisible: false,
            header: null,
        }
    },
    TransferScreen: {
        screen: CampaignTransferPayment,
        navigationOptions: {
            title: 'Payment',
            tabBarVisible: false,
        }
    },
    DeliveryScreen: {
        screen: CampaignDeliveryPayment,
        navigationOptions: {
            title: 'Delivery',
            tabBarVisible: false,
        }
    },
})

export const DepositoStack = StackNavigator({
    ListScreen: {
        screen: DepositoList,
    },
    ProfileScreen: {
        screen: Profile,
    },
    LoginScreen: {
        screen: Login,
        navigationOptions: {
            tabBarVisible: false,
            header: null,
        }
    },
    DonateScreen: {
        screen: SaldoPayment,
        navigationOptions: {
            title: 'Saldo',
            tabBarVisible: false,
        }
    },
    TransferScreen: {
        screen: SaldoTransferPayment,
        navigationOptions: {
            title: 'Payment',
            tabBarVisible: false,
        }
    },
    DeliveryScreen: {
        screen: SaldoDeliveryPayment,
        navigationOptions: {
            title: 'Delivery',
            tabBarVisible: false,
        }
    },
})

export const NewsStack = StackNavigator({
    ListScreen: {
        screen: NewsList,
    },
    ProfileScreen: {
        screen: Profile,
    },
    LoginScreen: {
        screen: Login,
        navigationOptions: {
            tabBarVisible: false,
            header: null,
        }
    },
    DetailScreen: {
        screen: NewsDetail,
        navigationOptions: {
            title: 'News',
            tabBarVisible: false,
        }
    },
})

export const ReportStack = StackNavigator({
    ListScreen: {
        screen: ReportList,
    },
    LoginScreen: {
        screen: Login,
        navigationOptions: {
            tabBarVisible: false,
            header: null,
        }
    },
    ProfileScreen: {
        screen: Profile,
    },
})

export const HomeTabs = TabNavigator({
    Campaign: {
        screen: CampaignStack,
        navigationOptions: {
            title: 'Campaign',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-megaphone' : 'ios-megaphone-outline'}
                    size={30}
                    style={{ color: tintColor }}
                />
            ),
        }
    },
    Deposito: {
        screen: DepositoStack,
        navigationOptions: {
            title: 'Deposito',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-card' : 'ios-card-outline'}
                    size={30}
                    style={{ color: tintColor }}
                />
            ),
        }
    },
    News: {
        screen: NewsStack,
        navigationOptions: {
            title: 'News',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-book' : 'ios-book-outline'}
                    size={30}
                    style={{ color: tintColor }}
                />
            ),
        }
    },
    Report: {
        screen: ReportStack,
        navigationOptions: {
            title: 'Report',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-cash' : 'ios-cash-outline'}
                    size={30}
                    style={{ color: tintColor }}
                />
            ),
        }
    },
}, {
        tabBarPosition: 'bottom',
        tabBarComponent: TabBarBottom,
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {
            labelStyle: {
                fontSize: 12,
            },
            activeTintColor: color.lightColor
        }
    })

export const AuthStack = StackNavigator({
    // LoginScreen: { screen: Login },
    HomeScreen: { screen: HomeTabs },
}, {
        headerMode: 'none',
    })