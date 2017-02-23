package com.lifekeyrn;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import za.co.io.reactnativecrypto.CryptoPackage;

import java.util.Arrays;
import java.util.List;

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
    MainApplication.this.mReactNativeHost.getReactInstanceManager().getCurrentReactContext()
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
    .emit("nativeEvent", "something");
  }
}
