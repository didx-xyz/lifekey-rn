for i in {1..10}; do 
  adb uninstall com.lifekeyrn
  react-native run-android
  sleep 7
done
