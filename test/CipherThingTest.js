import assert from 'assert';

import CipherThing, {genRandomBytes, hash} from '../src/cryptothings/CipherThing.js';
const cipher = new CipherThing();


describe('CipherThing', function () {
    describe('#genRandomBytes()', function () {
        it('should gen key (Buffer) without error', async function () {
            const key = await genRandomBytes(16);
            assert.equal(key.length, 16);
            });
        });

    describe('#encrypt() and #decrypt()', function () {
        it('should encrypt string and decrypt it later without an error', async function () {
            const testString = (await genRandomBytes(16));
            const testPassword = (await genRandomBytes(16));

            const encrypted = await cipher.encrypt(testPassword, testString)
            const decrypted = await cipher.decrypt(testPassword, encrypted);
            
            assert.equal(decrypted.toString('base64'), testString.toString('base64'));
        });
    });

    describe('#hash()', function () {
        it('should hash password with PBKDF2 without error', async function () {
          const password = await genRandomBytes(16);
          const salt = await genRandomBytes(16);
          const iterations = 200000; //Math.floor(Math.random() * 1000000);

          const hash1 = await hash(password, iterations, salt);
          const hash2 = await hash(password, iterations, salt);

          assert.equal(hash1.toString('base64'), hash2.toString('base64'));
        });
      });
});
