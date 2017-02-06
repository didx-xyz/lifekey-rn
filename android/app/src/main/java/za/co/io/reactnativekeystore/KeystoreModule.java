package za.co.io.reactnativekeystore;

import java.security.cert.CertificateFactory;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;

import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;

import javax.crypto.KeyGenerator;
import java.util.List;
import java.io.*;
import java.util.Collection;

import android.util.Log;
import android.content.Context;
import android.content.res.AssetManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;


public class KeystoreModule extends ReactContextBaseJavaModule {

  // Errors
  private final static byte E_NO_SUCH_ALGORITHM = 81;
  private final static byte E_KEYSTORE = 82;
  private final static byte E_IO_EXCEPTION = 83;

  // Asymmetric keys
  private final static byte DH = 10;
  private final static byte DSA = 11;
  private final static byte EC = 12;
  private final static byte RSA = 13;

  // Symmetric keys
  private final static byte AES = 20;
  private final static byte AESWRAP = 21;
  private final static byte ARC4 = 22;
  private final static byte BLOWFISH = 23;
  private final static byte DES = 24;
  private final static byte DESEDE = 25;
  private final static byte DESEDEWRAP = 26;
  private final static byte HMACMD5 = 27;
  private final static byte HMACSHA1 = 28;
  private final static byte HMACSHA256 = 29;
  private final static byte HMACSHA384 = 30;
  private final static byte HMACSHA512 = 31;
  private final static byte RC4 = 32;

  private final static String LOGTAG = "RNKEYSTORE";

  private KeyStore keyStore = null;
  private AssetManager assetManager = null;
  private final static String keyStoreAlias = "rnkeystore";
  private final static String keyStoreType = "AndroidKeyStore";

  // private KeyPairGenerator keyPairGenerator;  // For asymmetric
  private KeyGenerator keyGenerator;          // For symmetric

  private Context context;

  public KeystoreModule(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
  }

  public String getName() {
    return "Keystore";
  }

  /**
   * @param type The byte type of an algorithm
   * @return name The name of the algorithm in Android as a String
   */
  private String getKeyNameFromType(int type) throws NoSuchAlgorithmException {
    switch(type) {
      // Symmetric
      case DH: return "DH";
      case DSA: return "DSA";
      case EC: return "EC";
      case RSA: return "RSA";
      // Asymmetric
      case AES: return "AES";
      case AESWRAP: return "AESWRAP";
      case ARC4: return "ARC4";
      case BLOWFISH: return "Blowfish";
      // TODO add the rest

      default: throw new NoSuchAlgorithmException();
    }
  }

  @ReactMethod
  public void newKeyPair(int type, String keyAlias, String password, String certificateFilename, Promise promise) throws IOException {

    // Log

    // Declare
    KeyPair keyPair = null;
    PrivateKey privateKey = null;
    PublicKey publicKey = null;
    char[] passwordCharacters = null;
    Certificate[] certChain = null;
    KeyPairGenerator keyPairGenerator = null;
    KeyStore keyStore = null;
    FileOutputStream fos = null;
    InputStream  is = null;
    BufferedReader br;

    // Do
    try {
      Log.d(LOGTAG, "newKeyPair " + getKeyNameFromType(type) + " " + keyAlias + " " + password);

      Log.d(LOGTAG, "init keystore");
      keyStore = KeyStore.getInstance(keyStoreType);
      Log.d(LOGTAG, "init keypairgenerator");
      keyPairGenerator = KeyPairGenerator.getInstance(getKeyNameFromType(type));
      // Create a keypair
      Log.d(LOGTAG, "generate keypair");
      keyPair = keyPairGenerator.genKeyPair();
      Log.d(LOGTAG, "extract priv");
      privateKey = keyPair.getPrivate();
      Log.d(LOGTAG, "extract public");
      publicKey = keyPair.getPublic();

      // Convert password to char array
      Log.d(LOGTAG, "convert pass to char");
      passwordCharacters = password.toCharArray();

      // Load certificate
      Log.d(LOGTAG, "load certificate chain");
      certChain = loadCertificateChain(certificateFilename);

      Log.d(LOGTAG, "Set entries");
      keyStore.setKeyEntry("private" + keyAlias, privateKey, passwordCharacters, certChain);
      keyStore.setKeyEntry("public" + keyAlias, publicKey, passwordCharacters, certChain);
      fos = new FileOutputStream(keyStoreAlias);
      keyStore.store(fos, passwordCharacters);
      promise.resolve("Worked");
    } catch(Exception e) {
      promise.reject(Integer.toString(E_NO_SUCH_ALGORITHM), e.toString());
    } finally {
      if(fos != null) {
        fos.close();
      }
    }
  }

  @ReactMethod
  public void create(String keyStoreName, String keyStorePassword, Promise promise) {
    FileInputStream fis = null;
    try {
      try {
        fis = new FileInputStream(keyStoreName);
        this.keyStore.load(fis, keyStorePassword.toCharArray());
      } finally {
        if(fis != null) {
          fis.close();
        }
      }
      // Log.d(LOGTAG, "Created new keystore: " + keyStoreName);
      promise.resolve(new Object());
    } catch (Exception e) {
      // Log.e(LOGTAG, e.toString());
      promise.reject(Integer.toString(E_IO_EXCEPTION), e.toString());
    }
  }

  private boolean load(String keyStoreName, String keyStorePassword) throws IOException {
    char[] passwordCharacters = keyStorePassword.toCharArray();
    FileInputStream fis = null;
      try {
        fis = new FileInputStream(keyStoreName);
        this.keyStore.load(fis, passwordCharacters);
      } catch (Exception e) {
        Log.d(LOGTAG, e.toString());
        return false;
      } finally {
        if( fis != null) {
          fis.close(); // IOException MOVE AROUND
        }
        return true;
      }

  }

  private Certificate[] loadCertificateChain(String certificateFilename) throws IOException, CertificateException {
    assetManager = context.getAssets();

    Log.d(LOGTAG, "init fis");
    FileInputStream fis = new FileInputStream(assetManager.open(certificateFilename));
    Log.d(LOGTAG, "init bis");
    BufferedInputStream bis = new BufferedInputStream(fis);
    Log.d(LOGTAG, "init cf");
    CertificateFactory cf = CertificateFactory.getInstance("x.509");

    while (bis.available() > 0) {
      Certificate cert = cf.generateCertificate(bis);
      Log.d(LOGTAG, cert.toString());
    }
    return new Certificate[3];
  }

  private void unlock(String keyStoreName) {
  }
}