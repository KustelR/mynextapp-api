import CipherThing, {genRandomBytes, hash} from '../src/cryptothings/CipherThing.js';
const cipher = new CipherThing();


describe('CipherThing', function () {
    describe('#genRandomBytes()', function () {
        test('should gen key (Buffer) without error', async function () {
            const key = await genRandomBytes(16);
            expect(key.length).toBe(16);
            });
        });

    describe('#encrypt() and #decrypt()', function () {
        test('should encrypt string and decrypt it later without an error', async function () {
            const testString = (await genRandomBytes(16));
            const testPassword = (await genRandomBytes(16));

            const encrypted = await cipher.encrypt(testPassword, testString)
            const decrypted = await cipher.decrypt(testPassword, encrypted);
            
            expect(decrypted.toString('base64')).toBe(testString.toString('base64'));
        });
    });
    describe('#hash()', function () {
        test('should hash password with PBKDF2 without error', async function () {
          const password = await genRandomBytes(16);
          const salt = await genRandomBytes(16);
          const iterations = 200000; //Math.floor(Math.random() * 1000000);

          const hash1 = await hash(password, iterations, salt);
          const hash2 = await hash(password, iterations, salt);

          expect(hash1.toString('base64')).toBe(hash2.toString('base64'));
        });
      });
});
