package com.lifekeyrn;

import android.app.Application;

import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.lifekeyrn.pushnotification.PushNotificationPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

import za.co.io.reactnativecrypto.CryptoPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
              new RCTCameraPackage(),
              new VectorIconsPackage(),
              new GoogleAnalyticsBridgePackage(),
              new CryptoPackage(),
              new PushNotificationPackage(),
              new ReactNativeDialogsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
