package za.co.io.reactnativekeystore;

import java.security.*;
import java.security.cert.CertificateFactory;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;

import javax.crypto.KeyGenerator;
import java.util.List;
import java.io.*;
import java.nio.charset.Charset;
import java.util.*;
import java.nio.charset.StandardCharsets;

import android.util.Log;
import android.util.Base64;
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

  // Asymmetric key types
  private final static String KEYPAIR_DH = "DH";
  private final static String KEYPAIR_DSA ="DSA";
  private final static String KEYPAIR_EC = "EC";
  private final static String KEYPAIR_RSA = "RSA";

  // Symmetric key types
  private final static String KEY_AES = "AES";
  private final static String KEY_AESWRAP = "AESWRAP";
  private final static String KEY_ARC4 = "ARC4";
  private final static String KEY_BLOWFISH = "Blowfish";
  private final static String KEY_DES = "DES";
  private final static String DESEDE = "DESede";
  private final static String DESEDEWRAP = "DESedeWRAP";
  private final static String HMACMD5 = "HmacMD5";
  private final static String HMACSHA1 = "HmacSHA1";
  private final static String HMACSHA256 = "HmacSHA224";
  private final static String HMACSHA384 = "HmacSHA256";
  private final static String HMACSHA512 = "HmacSHA512";
  private final static String RC4 = "RC4";

  // Signature algorithms
  private final static String SIG_DSA = "DSA";
  private final static String SIG_DSA_WITH_SHA1 = "DSAwithSHA1";
  private final static String SIG_DSS = "DSS";
  private final static String SIG_ECDSA = "ECDSA";
  private final static String SIG_ECDSA_WITH_SHA1 = "ECDSAwithSHA1";
  private final static String SIG_MD2_WITH_RSA = "MD2withRSA";
  private final static String SIG_MD4_WITH_RSA = "MD4withRSA";
  private final static String SIG_MD5_WITH_RSA = "MD5withRSA";
  private final static String SIG_MD5_WITH_RSA_ISO9796_2 = "MD5withRSA/ISO9796-2";
  private final static String SIG_NONE_WITH_DSA = "NONEwithDSA";
  private final static String SIG_NONE_WITH_ECDSA = "NONEwithECDSA";
  private final static String SIG_NONE_WITH_RSA = "NONEwithRSA";
  private final static String SIG_RSASSA_PSS = "RSASSA-PSS";
  private final static String SIG_SHA1_WITH_DSA = "SHA1withDSA";
  private final static String SIG_SHA1_WITH_ECDSA = "SHA1withECDSA";
  private final static String SIG_SHA1_WITH_RSA = "SHA1withRSA";
  private final static String SIG_SHA1_WITH_RSA_ISO9796_2 = "SHA1withRSA/ISO9796-2";
  private final static String SIG_SHA256_WITH_ECDSA = "SHA256withECDSA";
  private final static String SIG_SHA256_WITH_RSA = "SHA256withRSA";
  private final static String SIG_SHA384_WITH_ECDSA = "SHA384withECDSA";
  private final static String SIG_SHA384_WITH_RSA = "SHA384withRSA";
  private final static String SIG_SHA512_WITH_ECDSA = "SHA512withECDSA";
  private final static String SIG_SHA512_WITH_RSA = "SHA512withRSA";

  // Digest algorithms
  private final static String DIGEST_MD5 = "MD5";
  private final static String DIGEST_SHA_1 = "SHA-1";
  private final static String DIGEST_SHA_224 = "SHA-224";
  private final static String DIGEST_SHA_256 = "SHA-256";
  private final static String DIGEST_SHA_384 = "SHA-384";
  private final static String DIGEST_SHA_512 = "SHA-512";

  // Keystore types
  private final static String STORE_ANDROID_CA_STORE = "AndroidCAStore";
  private final static String STORE_ANDROID_KEY_STORE = "AndroidKeyStore";
  private final static String STORE_BCPKCS12 = "BCPKCS12";
  private final static String STORE_BKS = "BKS";
  private final static String STORE_BOUNCY_CASTLE = "BouncyCastle";
  private final static String STORE_PKCS12 = "PKCS12";
  private final static String STORE_PKCS12_DEF = "PKCS12_DEF";

  // Constants
  private final static String LOGTAG = "RNKEYSTORE";

  // Instance properties
  private KeyStore keyStore = null;
  // private KeyGenerator keyGenerator = null; // For symmetric
  private AssetManager assetManager = null;
  private String keyStoreType = null;

  private String provider = null;
  private String alias = null;
  private static int RANDOM_SEED_SIZE = 64;
  private static int KEY_SIZE = 1024;
  // private KeyPairGenerator keyPairGenerator;  // For asymmetric

  private Context context;

  public KeystoreModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
    this.keyStoreType = KeyStore.getDefaultType(); // default
  }

  @ReactMethod
  public void getKeyAsPem(String keyAlias, String keyPassword, Promise promise) throws KeyStoreException, NoSuchAlgorithmException, UnrecoverableKeyException {
    Key key = (Key)this.keyStore.getKey(keyAlias, keyPassword.toCharArray());
    String pemFormatted = "-----BEGIN PUBLIC KEY-----\n" + Base64.encodeToString(key.getEncoded(), Base64.NO_PADDING) + "-----END PUBLIC KEY-----\n";
    Log.d(LOGTAG, pemFormatted);
    promise.resolve(pemFormatted);
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    // Keystore types
    constants.put("STORE_ANDROID_CA_STORE", STORE_ANDROID_CA_STORE);
    constants.put("STORE_ANDROID_KEY_STORE", STORE_ANDROID_KEY_STORE);
    constants.put("STORE_BCPKCS12", STORE_BCPKCS12);
    constants.put("STORE_BKS", STORE_BKS);
    constants.put("STORE_BOUNCY_CASTLE", STORE_BOUNCY_CASTLE);
    constants.put("STORE_PKCS12", STORE_PKCS12);
    constants.put("STORE_PKCS12_DEF", STORE_PKCS12_DEF);

    // Asymmetric keys
    constants.put("KEYPAIR_DH", KEYPAIR_DH);
    constants.put("KEYPAIR_DSA", KEYPAIR_DSA);
    constants.put("KEYPAIR_EC", KEYPAIR_EC);
    constants.put("KEYPAIR_RSA", KEYPAIR_RSA);
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
  public void digest(String dataString, String algorithm, Promise promise) {
    try {
      byte[] data = dataString.getBytes(StandardCharsets.UTF_8);
      MessageDigest md = MessageDigest.getInstance(algorithm);
      byte[] hash = md.digest(data);
      String hex = this.bytesToHex(hash);
      promise.resolve(hex);
    } catch(NoSuchAlgorithmException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void sign(String dataString, String privateKeyAlias, String privateKeyPassword, String algorithm, Promise promise) {
    if(this.keyStore == null) {
      promise.reject(new KeyStoreException("Keystore must first be loaded"));
      return;
    }
    // Sign with keys
    try {
      PrivateKey privateKey = (PrivateKey)this.keyStore.getKey(privateKeyAlias, privateKeyPassword.toCharArray());
      Signature sig = Signature.getInstance(algorithm);
      sig.initSign(privateKey, this.newSecureRandom());
      byte[] data = dataString.getBytes(StandardCharsets.UTF_8);
      sig.update(data);
      byte[] signature = sig.sign();
      promise.resolve(this.bytesToHex(signature));
    } catch(NoSuchAlgorithmException e) {
      promise.reject(e);
    } catch(KeyStoreException e) {
      promise.reject(e);
    } catch(InvalidKeyException e) {
      promise.reject(e);
    } catch(SignatureException e) {
      promise.reject(e);
    } catch(UnrecoverableKeyException e) {
      promise.reject(e);
    }

  }

  @ReactMethod
  public void verify(String signature, String publicKeyAlias, String publicKeyPassword, String algorithm, Promise promise) {
    if(this.keyStore == null) {
      promise.reject(new KeyStoreException("Keystore must first be loaded"));
      return;
    }
    // Verify with keys
    try {
      PublicKey publicKey = (PublicKey)this.keyStore.getKey(publicKeyAlias, publicKeyPassword.toCharArray());
      Signature sig = Signature.getInstance(algorithm);
      sig.initVerify(publicKey);
      boolean result = sig.verify(this.hexToBytes(signature));
      promise.resolve(result);
    } catch(InvalidKeyException e) {
      promise.reject(e);
    } catch(KeyStoreException e) {
      promise.reject(e);
    } catch(NoSuchAlgorithmException e) {
      promise.reject(e);
    } catch(SignatureException e) {
      promise.reject(e);
    } catch(UnrecoverableKeyException e) {
      promise.reject(e);
    }
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
  public void addKeyPair(String type, String keyAlias, String password, String certificateFilename, Promise promise) throws IOException {
    if(this.keyStore == null) {
      promise.reject(new KeyStoreException("Keystore must first be loaded"));
      return;
    }
    FileOutputStream fos = null;

    try {
      Log.d(LOGTAG, "newKeyPair " + type + " " + keyAlias + " " + password);

      KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(type);
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
   * @param name The name of the keystore
   * @return The absolute path of the keystore file
   */
  private String absolutePath(String name) throws IOException {
    Log.d(LOGTAG, this.getStoresFolder().getPath() + "/" + name);
    return this.getStoresFolder().getPath() + "/" + name;
  }

  private static String bytesToHex(byte[] bytes) {
    // http://stackoverflow.com/questions/9655181/how-to-convert-a-byte-array-to-a-hex-string-in-java/9855338#9855338
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

  private static byte[] hexToBytes(String s) {
      // http://stackoverflow.com/questions/140131/convert-a-string-representation-of-a-hex-dump-to-a-byte-array-using-java/140861#140861
      int len = s.length();
      byte[] data = new byte[len / 2];
      for (int i = 0; i < len; i += 2) {
          data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                              + Character.digit(s.charAt(i+1), 16));
      }
      return data;
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