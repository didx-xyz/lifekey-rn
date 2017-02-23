
package com.lifekeyrn.pushnotification;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.google.firebase.messaging.RemoteMessage.Notification;

import java.util.Iterator;
import java.util.Map;

import static com.lifekeyrn.pushnotification.PushNotificationModule.sendMessageReceivedEvent;


public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "FirebaseMessaging";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

        // the msg we're going to emit
        WritableMap msg = Arguments.createMap();

        msg.putString("from", remoteMessage.getFrom());
        msg.putString("to", remoteMessage.getTo());
        msg.putString("collapseKey", remoteMessage.getCollapseKey());
        msg.putString("sendTime", String.valueOf(remoteMessage.getSentTime()));
        msg.putString("type", remoteMessage.getMessageType());

        if (remoteMessage.getData().size() > 0) {
            WritableMap data = Arguments.createMap();
            Map<String, String> msgData = remoteMessage.getData();
            Iterator<String> keys = msgData.keySet().iterator();
            Iterator<String> values = msgData.values().iterator();
            while (keys.hasNext() && values.hasNext()) {
                data.putString(keys.next(), values.next());
            }
            msg.putMap("data", data);
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
            WritableMap notification = Arguments.createMap();
            Notification n = remoteMessage.getNotification();
            notification.putString("title", n.getTitle());
            notification.putString("body", n.getBody());
            notification.putString("tag", n.getTag());
            notification.putString("clickAction", n.getClickAction());
            notification.putString("color", n.getColor());
            notification.putString("sound", n.getSound());
            notification.putString("link", n.getLink().toString()); // TODO test this - not sure how instances of Uri must be coerced to String
            msg.putMap("notification", notification);
        }

        try {
            // if the RN native module is not yet initialised, this will throw
            sendMessageReceivedEvent(msg);
        } catch (Throwable t) {
            // so if it threw, just store the message to be fetched manually later
            PushNotificationData.MESSAGES.add(msg);
        }
    }
}