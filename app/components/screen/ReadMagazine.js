import React, { Component } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import { baseUrl } from '../config/variable'

import Pdf from 'react-native-pdf'
 
export default class ReadMagazine extends Component {
    render() { 
        let magazine = this.props.navigation.state.params.magazine
        const source = { uri: baseUrl + "public/magazine/" + magazine.name, cache: true }
        return (
            <View style={magzStyle.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        console.log(`number of pages: ${numberOfPages}`)
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        console.log(`current page: ${page}`)
                    }}
                    onError={(error)=>{
                        console.log(error)
                    }}
                    style={magzStyle.pdf}/>
            </View>
        )
  }
}
 
const magzStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
})