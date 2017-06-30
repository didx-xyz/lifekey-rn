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

}

