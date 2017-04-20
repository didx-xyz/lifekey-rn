#!/usr/bin/env bash
adb uninstall com.lifekeyrn
cd bin
./clear_packager_tmp
kill $(ps | grep "react-native/launchPackager.command" | grep bash | awk '{ print $1}') 2> /dev/null
kill $(ps | grep "react-native/packager/../local-cli.cli.js" | grep node | awk '{print$1}') 2> /dev/null
cd .. 
react-native run-android && ./bin/log_android_clean
