
package com.lifekeyrn.pushnotification;

import android.util.Log;

import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

import static com.lifekeyrn.pushnotification.PushNotificationModule.sendTokenRefreshedEvent;

public class MyFirebaseInstanceIDService extends FirebaseInstanceIdService {
    private static final String TAG = "FirebaseToken";

    @Override
    public void onTokenRefresh() {
        // Get updated InstanceID token.
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d(TAG, "Refreshed token: " + refreshedToken);

        PushNotificationData.TOKEN = refreshedToken;
        try {
            // this shouldn't throw if the native module is initialised
            sendTokenRefreshedEvent(refreshedToken);
        } catch (Throwable t) {
            // but if it does, just set the token in static data so it may be fetched manually later
            PushNotificationData.TOKEN = refreshedToken;
        }
    }
}