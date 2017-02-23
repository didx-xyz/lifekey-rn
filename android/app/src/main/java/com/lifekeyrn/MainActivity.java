package com.lifekeyrn;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.JavaScriptModule;
import android.content.Context;
import android.os.Bundle;

// import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import android.util.Log;

public class MainActivity extends ReactActivity {

    private static final String TAG = "MainActivity";
    // private static Context context;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        // ReactInstanceManager rim = this.getReactInstanceManager();
        // Log.d("TEST", rim.getCurrentReactContext().toString());
        // getReactInstanceManager().getCurrentReactContext()
        // .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        // .emit("nativeEvent", "something");

    }

    @Override
    protected String getMainComponentName() {
        return "Lifekeyrn";
    }


}
