import React, { Component } from 'react';
import { TabNavigator, StackNavigator } from "react-navigation";
import { Icon } from "native-base";

import CampaignList from "../screen/CampaignList";
import CampaignDetail from "../screen/CampaignDetail";
import DepositoList from "../screen/DepositoList";
import NewsList from "../screen/NewsList";
import NewsDetail from "../screen/NewsDetail";
import CampaignDetailDonatur from '../screen/CampaignDetailDonatur';
import CampaignDetailStory from '../screen/CampaignDetailStory';
import CampaignDetailText from '../screen/CampaignDetailText';
import CampaignPayment from "../screen/CampaignPayment";
import CampaignTransferPayment from "../screen/CampaignTransferPayment";
import CampaignDeliveryPayment from "../screen/CampaignDeliveryPayment";
import SaldoPayment from "../screen/SaldoPayment";
import SaldoTransferPayment from "../screen/SaldoTransferPayment";
import SaldoDeliveryPayment from "../screen/SaldoDeliveryPayment";
import ReportList from '../screen/ReportList';
import Login from "../screen/Login";

export const CampaignStack = StackNavigator({
    ListScreen: {
        screen: CampaignList,
        navigationOptions: {
            title: 'Galangbersama',
        }
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
});

export const DepositoStack = StackNavigator({
    ListScreen: {
        screen: DepositoList,
        navigationOptions: {
            title: 'Galangbersama',
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
});

export const NewsStack = StackNavigator({
    ListScreen: {
        screen: NewsList,
        navigationOptions: {
            title: 'Galangbersama',
        }
    },
    DetailScreen: {
        screen: NewsDetail,
        navigationOptions: {
            title: 'News',
            tabBarVisible: false,
        }
    },
});

export const ReportStack = StackNavigator({
    ListScreen: {
        screen: ReportList,
        navigationOptions: {
            title: 'Galangbersama',
        }
    }
});

export const HomeTabs = TabNavigator({
    Campaign: {
        screen: CampaignStack,
        navigationOptions:{
            title: 'Campaign',
        }
    },
    Deposito: {
        screen: DepositoStack,
        navigationOptions:{
            title: 'Deposito',
        }
    },
    News: {
        screen: NewsStack,
        navigationOptions:{
            title: 'News',
        }
    },
    Report: {
        screen: ReportStack,
        navigationOptions:{
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
});

export const AuthStack = StackNavigator({
    LoginScreen: { screen: Login },
    HomeScreen: { screen: HomeTabs },
},{
    headerMode: 'none',
});