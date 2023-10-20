import mongoose, {Schema} from 'mongoose';
import assert from 'assert';

import 'dotenv/config'


describe('MongoDB connection health test', function () {
    describe('Creating test file', function () {
        it('should create new document without error', async function () {
            const connectionString = process.env.MONGODB_URI;

            const testSchema = new Schema({ test: String });
            const Test = mongoose.model('Test', testSchema);
            const test = new Test({test: "test"});

            mongoose.connect(connectionString + '/healthcheck');
            test.save();
            assert.ok(Test.find({test: "test"}).length != 0)
            mongoose.disconnect();
            });
        });
})