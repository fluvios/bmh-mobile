import React, { Component } from 'react'
import { StyleSheet, Dimensions, View, Platform } from 'react-native'
import { Button, Footer, FooterTab, Text } from "native-base"
import { baseUrl } from '../config/variable'

import Pdf from 'react-native-pdf'
import RNFetchBlob from 'react-native-fetch-blob'

export default class ReadMagazine extends Component {

    constructor(props) {
        super(props)

        this.state = ({
            magazine: this.props.navigation.state.params.magazine
        })
    }

    download() {
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
            .config({
                // fileCache: true,
                // by adding this option, the temp files will have a file extension
                // appendExt: 'pdf',
                path: dirs.DocumentDir,
                addAndroidDownloads: {
                    useDownloadManager: true, // <-- this is the only thing required
                    // Optional, override notification setting (default to true)
                    notification: false,
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    mime: 'application/pdf',
                    description: 'Magazine are being downloaded.'
                }
            })
            .fetch('GET', baseUrl + "public/magazine/" + this.state.magazine.name, {
                //some headers ..
            })
            .then((res) => {
                // the temp file path with file extension `pdf`
                alert('Magazine successfully downloaded')
            })
    }

    render() {
        const source = { uri: baseUrl + "public/magazine/" + this.state.magazine.name, cache: true }
        return (
            <View style={magzStyle.container}>
                <Pdf
                    source={source}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`)
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`)
                    }}
                    onError={(error) => {
                        console.log(error)
                    }}
                    style={magzStyle.pdf} />
                <Footer>
                    <FooterTab>
                        <Button style={{ backgroundColor: '#f38d1f' }}
                            onPress={() => this.download()}>
                            <Text style={{ color: '#fff' }}>Download</Text>
                        </Button>
                    </FooterTab>
                </Footer>
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
        flex: 1,
        width: Dimensions.get('window').width,
    }
})