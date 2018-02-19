import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import {
    Body, Button, Content, Card,
    CardItem, Header, Footer, Text
} from "native-base";
import { styles } from "../config/styles";
import Storage from 'react-native-storage';

var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
})

export default class DepositoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saldo: 0,
        };
    }

    componentWillMount() {
        this.loadStorage();
    }

    getAccount(params, callback) {
        fetch("http://galangbersama.com/api/account/" + params + "/refresh", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(json => callback(json))
            .catch((error) => {
                console.error(error);
            })
            .done();
    }

    loadStorage() {
        storage.load({
            key: 'user'
        }).then(ret => this.getAccount(ret.id, response => {
            this.setState({
                saldo: response.saldo
            })
        })).catch(err => {
            console.log(err.message)
        });
    }

    render() {
        return (
            <Content>
                <Card>
                    <CardItem>
                        <Body>
                            <Text style={styles.textHeader}>Saldo BMH</Text>
                            <Text style={styles.textContent}>Rp. {this.state.saldo}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Button full textStyle={{ color: '#87838B' }}
                    onPress={() => this.props.navigation.navigate('DonateScreen')}>
                    <Text>Add Saldo</Text>
                </Button>
            </Content>
        );
    }
}