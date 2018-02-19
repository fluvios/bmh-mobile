import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, ListView,
  View, Image, TouchableHighlight, Linking
} from 'react-native';
import {
  Container, Header, Left, Body, Right, Title,
  Content, Footer, FooterTab, Button, Text, Card,
  CardItem, Thumbnail, Spinner,
} from 'native-base';
import { cleanTag, convertToSlug, shortenDescription } from '../config/helper';

export default class NewsListInspirasi extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card style={{ flex: 0 }}>
        <CardItem>
          <Text>
            Data not found
          </Text>
        </CardItem>
      </Card>
    )
  }
}