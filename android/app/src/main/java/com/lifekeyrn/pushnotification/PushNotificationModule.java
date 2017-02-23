package com.lifekeyrn.pushnotification;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class PushNotificationModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext rctx;

    public PushNotificationModule(ReactApplicationContext rctx) {
        super(rctx);
        PushNotificationModule.rctx = rctx;
    }

    public static void sendTokenRefreshedEvent(String value) {
        rctx.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter.class
        ).emit("tokenRefreshed", value);
    }

    public static void sendMessageReceivedEvent(WritableMap msg) {
        rctx.getJSModule(
                DeviceEventManagerModule.RCTDeviceEventEmitter.class
        ).emit("messageReceived", msg);
    }

    @ReactMethod
    public void getToken(Promise promise) {
        // NOTE
        // this method should be called when the app is booted or
        // when the app resumes from paused state (essentially, any
        // scenario where the event emission may have been missed)

        // get the current value
        String id = PushNotificationData.TOKEN;
        // reset it
        PushNotificationData.TOKEN = null;
        // send to js
        promise.resolve(id);
    }

    @ReactMethod
    public void getMessages(Promise promise) {
        // NOTE
        // this method should be called when the app is booted or
        // when the app resumes from paused state (essentially, any
        // scenario where the event emission may have been missed)

        WritableArray msgs = Arguments.createArray();
        for (int i = 0, len = PushNotificationData.MESSAGES.size(); i < len; i++) {
            msgs.pushMap(PushNotificationData.MESSAGES.get(i));
        }
        PushNotificationData.MESSAGES.clear();
        promise.resolve(msgs);
    }

    @ReactMethod
    public void getMessage(int index, Promise promise) {
        // NOTE
        // this method should be called when the app is booted or
        // when the app resumes from paused state (essentially, any
        // scenario where the event emission may have been missed)
        if (PushNotificationData.MESSAGES.isEmpty()) {
            promise.resolve(null);
            return;
        }
        WritableMap msg = PushNotificationData.MESSAGES.get(index);
        PushNotificationData.MESSAGES.remove(index);
        promise.resolve(msg);
    }

    @ReactMethod
    public void getMessagesLength(Promise promise) {
        promise.resolve(PushNotificationData.MESSAGES.size());
    }

    @Override
    public Map<String, Object> getConstants() {
        return new HashMap<>();
    }

    @Override
    public String getName() {
        return "PushNotifications";
    }
}
