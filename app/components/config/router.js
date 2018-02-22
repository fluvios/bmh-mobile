import React from 'react'
import { TabNavigator, StackNavigator } from "react-navigation"

import CampaignList from "../screen/CampaignList"
import CampaignDetail from "../screen/CampaignDetail"
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
        }
    },
    Deposito: {
        screen: DepositoStack,
        navigationOptions: {
            title: 'Deposito',
        }
    },
    News: {
        screen: NewsStack,
        navigationOptions: {
            title: 'News',
        }
    },
    Report: {
        screen: ReportStack,
        navigationOptions: {
            title: 'Report',
        }
    },
}, {
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {
            labelStyle: {
                fontSize: 11,
            }
        }
    })

export const AuthStack = StackNavigator({
    // LoginScreen: { screen: Login },
    HomeScreen: { screen: HomeTabs },
}, {
        headerMode: 'none',
    })