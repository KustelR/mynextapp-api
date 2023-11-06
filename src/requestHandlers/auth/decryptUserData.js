async function decryptUserData(passwordHash, data, cipher) {
  let encryptionKey;
  try {
    encryptionKey = await cipher.decrypt(passwordHash, data.encryptedkey);
    delete data["encryptedkey"];
  } catch (error) {
    if (error.reason == "bad decrypt") {
      throw new Error("invalid password");
    }
    throw error;
  }
  let decryptedData = {};

  const entriesEncrypted = Object.entries(data);
  for (let i = 0; i < entriesEncrypted.length; i++) {
    const key = entriesEncrypted[i][0];
    const value = entriesEncrypted[i][1];
    let decrypted;

    try {
      decrypted = await cipher.decrypt(encryptionKey, Buffer.from(value));
    } catch (e) {
      console.error(e);
    }

    decryptedData[key] = decrypted;
  }
  return decryptedData;
}

export default decryptUserData;
