package za.co.io.reactnativekeystore;

import java.security.cert.CertificateFactory;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;

import java.security.*;

import javax.crypto.KeyGenerator;
import java.util.List;
import java.io.*;
import java.util.*;

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
import com.facebook.react.bridge.WritableNativeArray;
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

  // Keystore types
  private final static String ANDROID_CA_STORE = "AndroidCAStore";
  private final static String ANDROID_KEY_STORE = "AndroidKeyStore";
  private final static String BCPKCS12 = "BCPKCS12";
  private final static String BKS = "BKS";
  private final static String BOUNCY_CASTLE = "BouncyCastle";
  private final static String PKCS12 = "PKCS12";
  private final static String PKCS12_DEF = "PKCS12_DEF";

  // Constants
  private final static String LOGTAG = "RNKEYSTORE";

  // Instance properties
  private KeyStore keyStore = null;
  // private KeyGenerator keyGenerator = null; // For symmetric
  private AssetManager assetManager = null;
  private String keyStoreType = null;

  private String provider = null;
  private String alias = null;
  private static int RANDOM_SEED_SIZE = 32;
  private static int KEY_SIZE = 256;
  // private KeyPairGenerator keyPairGenerator;  // For asymmetric

  private Context context;

  public KeystoreModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
    this.keyStoreType = KeyStore.getDefaultType(); // default
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    // Keystore types
    constants.put("ANDROID_CA_STORE", ANDROID_CA_STORE);
    constants.put("ANDROID_KEY_STORE", ANDROID_KEY_STORE);
    constants.put("BCPKCS12", BCPKCS12);
    constants.put("BKS", BKS);
    constants.put("BOUNCY_CASTLE", BOUNCY_CASTLE);
    constants.put("PKCS12", PKCS12);
    constants.put("PKCS12_DEF", PKCS12_DEF);

    // Asymmetric keys
    constants.put("DH", DH);
    constants.put("DSA", DSA);
    constants.put("EC", EC);
    constants.put("RSA", RSA);
    return constants;
  }

  public String getName() {
    return "Keystore";
  }

  @ReactMethod
  public void getAlias(Promise promise) {
    try {
      if(this.keyStore == null || this.alias == null) {
        throw new KeyStoreException("Keystore must first be loaded");
      }
      promise.resolve(this.alias);
    } catch(KeyStoreException e) {
      promise.reject(e);
    }
  }

  /**
   * List all files/folders in the given store path. Store
   * path is relative to app path
   * @param Relative directory to look in (/ for app root dir)
   * @param WritableNativeArray the files/folders in the directory
   * @category DONE
   */
  @ReactMethod
  public void listStores(Promise promise) {
    try {
      File keyStoreFolder = this.getStoresFolder();
      File[] listOfFiles = keyStoreFolder.listFiles();
      WritableNativeArray names = new WritableNativeArray();
      for(int i = 0; i < listOfFiles.length; i++) {
        names.pushString(listOfFiles[i].getName());

        Log.d(LOGTAG, listOfFiles[i].getName());
      }
      promise.resolve(names);
    } catch(IOException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void deleteStore(String name, Promise promise) {
    try {
      File store = new File(this.absolutePath(name));
      store.delete();
      promise.resolve(null);
    } catch(SecurityException e) {
      promise.reject(e);
    } catch(IOException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void aliases(Promise promise) {
    try {
      if(this.keyStore == null) {
        throw new KeyStoreException("Keystore must first be loaded");
      }
      WritableNativeArray map = new WritableNativeArray();
      java.util.Enumeration<String> aliases = this.keyStore.aliases();
      while (aliases.hasMoreElements()) {
        map.pushString(aliases.nextElement());
      }
      promise.resolve(map);
    } catch(KeyStoreException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void containsAlias(String alias, Promise promise) {
    try {
      if(this.keyStore == null) {
        throw new KeyStoreException("Keystore must first be loaded");
      }
      boolean found = this.keyStore.containsAlias(alias);
      promise.resolve(found);
    } catch(KeyStoreException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void deleteEntry(String alias, Promise promise) {
    try {
      if(this.keyStore == null) {
        throw new KeyStoreException("Keystore must first be loaded");
      }
      this.keyStore.deleteEntry(alias);
      promise.resolve(null);
    } catch(KeyStoreException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void getCertificate(String alias, Promise promise) {
    try {
      if(this.keyStore == null) {
        throw new KeyStoreException("Keystore must first be loaded");
      }
      Certificate certificate = this.keyStore.getCertificate(alias);
      promise.resolve(certificate.toString());
    } catch(KeyStoreException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void size(Promise promise) {
    try {
      if(this.keyStore == null) {
        throw new KeyStoreException("Keystore must first be loaded");
      }
      int size = this.keyStore.size();
      promise.resolve(size);
    } catch(KeyStoreException e) {
      promise.reject(e);
    }
  }

  /**
   * Load a keystore from file
   * @param filename
   * @param password
   */
  @ReactMethod
  public void load(String name, String password, Promise promise) {

    char[] passwordCharacters = password.toCharArray();
    FileInputStream fis = null;

    try {
      if(this.keyStore == null) {
        this.init();
      }
      fis = new FileInputStream(this.absolutePath(name));
      this.keyStore.load(fis, passwordCharacters);
      this.alias = name;
      promise.resolve(null);
    } catch(NoSuchAlgorithmException e) {
      promise.reject(Byte.toString(E_NO_SUCH_ALGORITHM));
    } catch(NullPointerException e) {
      promise.reject("The keystore must first be initialised");
    } catch (FileNotFoundException e) {
      promise.reject(e);
    } catch (KeyStoreException e) {
      promise.reject(e);
    } catch (CertificateException e) {
      promise.reject(e);
    } catch(IOException e) {
      promise.reject(e);
    } finally {
      if( fis != null) {
        try {
          fis.close();
        } catch(IOException e) {
          promise.reject(e);
        }
      }
    }
  }


  /**
 * Create a new keystore in the application directory
 * @param name The name of the keystore
 * @param password The password to lock/unlock the keystore
 * @return True on success
 */
  @ReactMethod
  public void create(String name, String password, Promise promise) throws IOException {
    String filePath = this.absolutePath(name);
    File keyStoreAbstract = new File(filePath);
    if(keyStoreAbstract.exists()) {
      promise.reject(new IOException("Keystore with name " + name + " already exists"));
      return;
    }

    FileOutputStream fos = null;
    char[] passwordCharacters = password.toCharArray();
    try {
      if(this.keyStore == null) {
        this.init();
      }
      fos = new FileOutputStream(filePath);
      this.keyStore.load(null, passwordCharacters);
      this.keyStore.store(fos, passwordCharacters);
      this.alias = name;
      promise.resolve(null);
    } catch(NullPointerException e) {
      promise.reject("The keystore must first be initialised");
    } catch(NoSuchAlgorithmException e) {
      promise.reject(e);
    } catch(KeyStoreException e) {
      promise.reject(e);
    } catch(CertificateException e) {
      promise.reject(e);
    } finally {
      if(fos != null) {
        try {
          fos.close();
        } catch(IOException e) {
          promise.reject(e);
        }
      }
    }
  }



  @ReactMethod
  public void sign() {
    // Sign with keys
  }

  @ReactMethod
  public void verify() {
    // Verify with keys
  }

  private SecureRandom newSecureRandom() {
    SecureRandom random = new SecureRandom();
    byte[] seed = random.generateSeed(RANDOM_SEED_SIZE);
    random.setSeed(seed);
    return random;
  }

  /**
   * @param type The byte type of an algorithm
   * @param keyAlias The alias of the keypair
   * @param password The password used to create they keypair
   * @param certificateFilename The filename/path of the X509 certificate the key is signed with
   * @param promise com.facebook.react.bridge.Promise;
   * @return void
   * @throws IOException
   */
  @ReactMethod
  public void addKeyPair(int type, String keyAlias, String password, String certificateFilename, Promise promise) throws IOException {
    if(this.keyStore == null) {
      promise.reject(new KeyStoreException("Keystore must first be loaded"));
      return;
    }
    FileOutputStream fos = null;

    try {
      Log.d(LOGTAG, "newKeyPair " + getKeyNameFromType(type) + " " + keyAlias + " " + password);
      // this.load(keyAlias, password);

      KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(getKeyNameFromType(type));
      keyPairGenerator.initialize(KEY_SIZE, this.newSecureRandom());
      // Create a keypair
      KeyPair keyPair = keyPairGenerator.genKeyPair();
      PrivateKey privateKey = keyPair.getPrivate();
      String privateKeyHex = KeystoreModule.bytesToHex(privateKey.getEncoded());
      PublicKey publicKey = keyPair.getPublic();
      String publicKeyHex = KeystoreModule.bytesToHex(publicKey.getEncoded());

      WritableMap map = Arguments.createMap();
      map.putString("privateKey", privateKeyHex);
      map.putString("publicKey", publicKeyHex);
      Log.d(LOGTAG, "Private\n"+privateKeyHex);
      Log.d(LOGTAG, "Public\n"+publicKeyHex);

      // Convert password to char array
      char[] passwordCharacters = password.toCharArray();

      // Load certificate
      Certificate x509Cert = this.loadCertificate(certificateFilename);
      Certificate[] certChain = new Certificate[1];
      certChain[0] = x509Cert;

      // Set entries
      this.keyStore.setKeyEntry("public" + keyAlias, publicKey, passwordCharacters, certChain);
      this.keyStore.setKeyEntry("private" + keyAlias, privateKey, passwordCharacters, certChain);

      // Write to file
      fos = new FileOutputStream(this.absolutePath(this.alias));
      this.keyStore.store(fos, passwordCharacters);

      // return the keys in hex through promise
      promise.resolve(map);
    } catch(Exception e) {
      promise.reject(e.toString());
    } finally {
      try {
        if(fos != null) {
          fos.close();
        }
      } catch(IOException e) {
        promise.reject(e);
      }
    }
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
   * @param name The name of the keystore
   * @return The absolute path of the keystore file
   */
  private String absolutePath(String name) throws IOException {
    Log.d(LOGTAG, this.getStoresFolder().getPath() + "/" + name);
    return this.getStoresFolder().getPath() + "/" + name;
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

  private Certificate loadCertificate(String certificateFilename) throws IOException, CertificateException {
    assetManager = context.getAssets();
    BufferedInputStream bis = new BufferedInputStream(assetManager.open(certificateFilename));
    CertificateFactory cf = CertificateFactory.getInstance("X.509");
    return cf.generateCertificate(bis);
  }

    /**
   * Initialise the keystore
   * @param The alias of the keystore
   * @param The provider name as string
   */
  private void init() throws KeyStoreException, IOException {
    this.keyStoreType = KeyStore.getDefaultType();
    this.keyStore = KeyStore.getInstance(this.keyStoreType);
  }

  /**
   * @category DONE
   */
  private File getStoresFolder() throws IOException {
    // init abstract folder
    File storesDirectory = new File(this.context.getFilesDir().getPath() + "/stores");
    // create if not exists
    if(!storesDirectory.exists()) {
      if(!storesDirectory.mkdir()) {
        throw new IOException("Could not create directory " + storesDirectory.getPath());
        //success
      }
    }
    return storesDirectory;

  }

}