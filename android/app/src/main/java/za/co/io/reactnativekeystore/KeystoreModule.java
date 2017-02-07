package za.co.io.reactnativekeystore;

import java.security.cert.CertificateFactory;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;

import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.GeneralSecurityException;
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
import com.facebook.react.bridge.Arguments;


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

  // Constants
  private final static String LOGTAG = "RNKEYSTORE";
  private final static String keyStoreAlias = "rnkeystore";
  private final static String keyStoreType = "AndroidKeyStore";

  // Instance properties
  private KeyStore keyStore = null;
  private KeyGenerator keyGenerator = null; // For symmetric
  private KeyPairGenerator keyPairGenerator = null;
  private AssetManager assetManager = null;

  // private KeyPairGenerator keyPairGenerator;  // For asymmetric

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

  /**
   * @param type The byte type of an algorithm
   * @param keyAlias The alias of the keypair
   * @param password The password used to creat they keypair
   * @param certificateFilename The filename/path of the X509 certificate the key is signed with
   * @param promise com.facebook.react.bridge.Promise;
   * @return void
   * @throws IOException
   */
  @ReactMethod
  public void newKeyPair(int type, String keyAlias, String password, String certificateFilename, Promise promise) throws IOException {

    // Declare
    KeyPair keyPair = null;
    PrivateKey privateKey = null;
    PublicKey publicKey = null;
    char[] passwordCharacters = null;
    Certificate x509Cert = null;
    // KeyPairGenerator keyPairGenerator = null;
    FileOutputStream fos = null;


    try {
      Log.d(LOGTAG, "newKeyPair " + getKeyNameFromType(type) + " " + keyAlias + " " + password);
      this.loadKeyStore(keyAlias, password);

      this.keyPairGenerator = KeyPairGenerator.getInstance(getKeyNameFromType(type));

      // Create a keypair
      keyPair = keyPairGenerator.genKeyPair();
      privateKey = keyPair.getPrivate();
      String privateKeyHex = KeystoreModule.bytesToHex(privateKey.getEncoded());
      publicKey = keyPair.getPublic();
      String publicKeyHex = KeystoreModule.bytesToHex(publicKey.getEncoded());

      WritableMap map = Arguments.createMap();
      map.putString("privateKey", privateKeyHex);
      map.putString("publicKey", publicKeyHex);
      Log.d(LOGTAG, publicKeyHex);
      Log.d(LOGTAG, privateKeyHex);
      // Convert password to char array
      passwordCharacters = password.toCharArray();


      // Load certificate
      x509Cert = this.loadCertificate(certificateFilename);
      Certificate[] certChain = new Certificate[1];
      certChain[0] = x509Cert;

      // Set entries
      this.keyStore.setKeyEntry("public" + keyAlias, publicKey, passwordCharacters, certChain);
      this.keyStore.setKeyEntry("private" + keyAlias, privateKey, passwordCharacters, certChain);

      // Write to file
      fos = new FileOutputStream(this.absolutePath(this.keyStoreAlias));
      this.keyStore.store(fos, passwordCharacters);

      // return the keys in hex through promise
      promise.resolve(map);
    } catch(Exception e) {
      promise.reject(Integer.toString(E_NO_SUCH_ALGORITHM), e.toString());
    } finally {
      if(fos != null) {
        fos.close();
      }
    }
  }

  /**
   * @param name The name of the keystore
   * @return The absolute path of the keystore file
   */
  private String absolutePath(String name) {
    return this.context.getFilesDir() + "/" + name;
  }

  private static String bytesToHex(byte[] bytes) {
    final char[] hexArray = {'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'};
    char[] hexChars = new char[bytes.length * 2];
    int v;
    for ( int j = 0; j < bytes.length; j++ ) {
        v = bytes[j] & 0xFF;
        hexChars[j * 2] = hexArray[v >>> 4];
        hexChars[j * 2 + 1] = hexArray[v & 0x0F];
    }
    return new String(hexChars);
}

/**
 * Create a new keystore in the application directory
 * @param name The name of the keystore
 * @param password The password to lock/unlock the keystore
 * @return True on success
 */
  private void createKeyStore(String name, String password) throws IOException, GeneralSecurityException {

    Log.d(LOGTAG, "Creating keystore "+name+", "+password);
    FileOutputStream fos = new FileOutputStream(this.context.getFilesDir() + "/" + name);
    char[] passwordCharacters = password.toCharArray();
    this.keyStore.load(null, passwordCharacters);
    this.keyStore.store(fos, passwordCharacters);


    Log.d(LOGTAG, "Closing " + this.context.getFilesDir() + "/" + name);
    if(fos != null) {
      fos.close();
    }


  }
  /**
   * Load a keystore by name, specifiying password and create a new keystore if it does not exist
   * @param name The name of they keystore
   * @param password The password to the keystore
   */
  private void loadKeyStore(String name, String password) throws IOException, GeneralSecurityException {
    char[] passwordCharacters = password.toCharArray();
    FileInputStream fis = null;
    try {
      // Load exisitng
      this.keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
      fis = new FileInputStream(this.context.getFilesDir() + "/" + name);
      this.keyStore.load(fis, passwordCharacters);
      Log.d(LOGTAG, "Key store " + name + " loaded");
    } catch (FileNotFoundException e) {
      // Create new
      Log.d(LOGTAG, "Key store does not exist, creating...");
      this.createKeyStore(name, password);
      Log.d(LOGTAG, "Key store created");
    } finally {
      if( fis != null) {
        Log.d(LOGTAG, "Closing file");
        fis.close();
      }
    }

  }

  private Certificate loadCertificate(String certificateFilename) throws IOException, CertificateException {
    assetManager = context.getAssets();
    BufferedInputStream bis = new BufferedInputStream(assetManager.open(certificateFilename));
    CertificateFactory cf = CertificateFactory.getInstance("X.509");
    return cf.generateCertificate(bis);
  }

}