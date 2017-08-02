import React from 'react'
import { Picker, Text, TextInput, View, ScrollView, ToastAndroid } from "react-native"
import { Container } from "native-base"
import Touchable from "./Components/Touchable"
import ModalPicker from "react-native-modal-picker"
import DatePicker from "react-native-datepicker"
import PropTypes from "prop-types"
import ImagePicker from "react-native-image-picker"
import ActivityIndicator from "ActivityIndicator"

import Countries from "./Countries"
import Languages from "./Languages"

import BackButton from "./Components/BackButton"

export default class Common {
    static schemaCheck(url, match){
        const search = new RegExp(`^(https?\:\/\/)?${url}$`, 'i')
        const result = search.test(match)
        return result
    }

    static schemaHasProtocol(match){
        const search = new RegExp(`^https?\:\/\/`, 'i')
        return search.test(match)
    }

    static ensureUrlHasProtocol(url){
        if(!Common.schemaHasProtocol(url)){
          url = `http://${url}`
        }

        return url
    }

    // Control the status bar visibility 
    static toggleStatusBar(statusbar, value, animation){
        statusbar.setHidden(value, animation)
        return Promise.resolve()
    }

    //strip image context 
    static ensureDataUrlIsCleanOfContext(url){
        if(!url) return ''
        const result = url.split(',')[1];
        if(result)
            return result
        else
            return url
    }

    static ensureDataUrlHasContext(url){
        if(!url) return ''
        url = this.ensureDataUrlIsCleanOfContext(url)    
        return `data:image/jpg;base64,${url}`
    }

    // Hit areas on buttons
    static touchableArea = {top: 140, left: 140, bottom: 140, right: 140}

}

