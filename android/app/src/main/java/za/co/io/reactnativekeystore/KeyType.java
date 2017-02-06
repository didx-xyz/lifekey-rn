package za.co.io.reactnativekeystore;

public enum KeyType {
  DH           ("DH"),  // Symmetrical
  EC           ("EC"),
  DSA          ("DSA"),
  RSA          ("RSA"),
  AES          ("AES"), // Asymmetrical
  AESWRAP      ("AESWRAP"),
  DES          ("DES"),
  DES_EDE      ("DESede"),
  DES_EDE_WRAP ("DESedeWRAP"),
  ARC4         ("ARC4"),
  BLOWFISH     ("BLOWFISH"),
  HMAC_MD5     ("HmacMD5"),
  HMAC_SHA1    ("HmacSHA1"),
  HMAC_SHA224  ("HmacSHA224"),
  HMAC_SHA256  ("HmacSHA256"),
  HMAC_SHA384  ("HmacSHA384"),
  HMAC_SHA512  ("HmacSHA256"),
  RC4          ("RC4");

  private final String code;

  KeyType(String code) {
    this.code = code;
  }

  public String code() { return code; }
}

