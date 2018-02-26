import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  textHeader: {
    fontSize: 28,
    color: '#537791',
    textAlign: 'center',
  },
  textContent: {
    fontSize: 16,
    color: '#537791',
    textAlign: 'center',
  },
  textInfo: {
    fontSize: 14,
  },
  textDate: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8
  },
  middleText: {
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    color: "#000000"
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF"
  },
  wrapCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviderColumn: {
    marginTop: 10,
  },
  deviderColumnDouble: {
    marginTop: 10,
    flexDirection:'row'
  },

  deviderRowLeft: {
    width: '48%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: '2%'
  },
  deviderRowRight: {
    width: '48%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginLeft: '2%'
  }
});