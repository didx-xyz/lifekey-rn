package za.co.io.firebasereset;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.google.firebase.iid.FirebaseInstanceId;

import java.io.IOException;

public class FirebaseResetModule extends ReactContextBaseJavaModule {
  
  public FirebaseResetModule(ReactApplicationContext rctx) {
    super(rctx);
  }

  public String getName() {
    return "FirebaseReset";
  }

  @ReactMethod
  public void new_token(Promise p) {
    FirebaseInstanceId fiid = FirebaseInstanceId.getInstance();
    try {
      fiid.deleteInstanceId();
    } catch (IOException ioe) {
      p.reject(ioe);
      return;
    }
    p.resolve(fiid.getToken());
  }
}