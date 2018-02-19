import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Root } from "native-base";
import { AuthStack } from './app/components/config/router';
import store from "./app/components/reducer/store";

export default class App extends Component {
  render() {

    return (
      <Provider store={store}>
        <Root>
          <AuthStack />
        </Root>
      </Provider>
    );
  }
}