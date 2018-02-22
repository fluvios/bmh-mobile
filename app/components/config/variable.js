import React from 'react';
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

// Define API URL
export const baseUrl = "http://bdv-hostmaster.com/";
export const wpUrl = "http://www.bmh.or.id/wp-json/wp/v2/";

// Define Storage
// export var bmhStorage = new Storage({
//     size: 1000,
//     storageBackend: AsyncStorage,
//     defaultExpires: null,
//     enableCache: true,
// })