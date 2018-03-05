import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Root } from "native-base"
import { AuthStack } from './app/components/config/router'
import store from "./app/components/reducer/store"
import moment from 'moment/min/moment-with-locales'
import Moment from 'react-moment'

// Sets the moment instance to use.
Moment.globalMoment = moment

// Set the locale for every react-moment instance to French.
Moment.globalLocale = 'id'

// Set the output format for every react-moment instance.
Moment.globalFormat = 'D MMM YYYY'

// Use a <span> tag for every react-moment instance.
Moment.globalElement = 'span'

// Upper case all rendered dates.
Moment.globalFilter = (d) => {
  return d.toUpperCase()
}

export default class App extends Component {
  render() {

    return (
      <Provider store={store}>
        <Root>
          <AuthStack />
        </Root>
      </Provider>
    )
  }
}