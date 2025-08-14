const { MongoClient } = require('mongodb');

// IMPORTANT: From your screenshots, your database appears to be 'test'.
// If your database has a different name, please change it here.
const MONGO_URI = 'mongodb+srv://ayaandhaqane4155:UjLgPAye4RW4MuwO@cluster0.irrptiz.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'test'; // Change 'test' if your database name is different
const COLLECTION_NAME = 'taxcollections';

// --- No more changes needed below this line ---

// Helper function to get the current quarter
function getCurrentQuarter() {
    const month = new Date().getMonth(); // 0-11
    if (month < 3) return 'Q1';
    if (month < 6) return 'Q2';
    if (month < 9) return 'Q3';
    return 'Q4';
}

async function updateQ2Records() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log('>>> Connected to MongoDB successfully!');

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Find all Q2 records
        const allQ2Records = await collection.find({ quarter: 'Q2' }).toArray();
        console.log(`Found ${allQ2Records.length} total Q2 records.`);

        // Filter for records with amount_due = 0 (any type)
        const zeroDueRecords = allQ2Records.filter(doc => {
            if (!doc.amount_due) return false;
            const val = doc.amount_due.toString();
            return val === '0' || val === '0.0' || val === '0.00';
        });

        console.log(`Found ${zeroDueRecords.length} Q2 records with amount_due = 0.`);

        let updatedCount = 0;
        const currentYear = new Date().getFullYear();
        const currentQuarter = getCurrentQuarter();

        for (const doc of zeroDueRecords) {
            const docYear = new Date(doc.due_date).getFullYear();

            // Check if this record is the current quarter of the current year
            if (doc.quarter === currentQuarter && docYear === currentYear) {
                console.log(`Skipping current quarter record: ID ${doc._id}`);
                continue; // Skip this one
            }

            // Update the record
            if (doc.amount_per_quarter && parseFloat(doc.amount_per_quarter.toString()) > 0) {
                const result = await collection.updateOne(
                    { _id: doc._id },
                    { $set: { amount_due: doc.amount_per_quarter, status: 'due' } }
                );
                if (result.modifiedCount > 0) {
                    console.log(`Updated record ID ${doc._id}: set amount_due to ${doc.amount_per_quarter}`);
                    updatedCount++;
                }
            } else {
                console.log(`Skipped record ID ${doc._id} due to invalid amount_per_quarter.`);
            }
        }

        console.log(`\nFinished. Successfully updated ${updatedCount} records.`);

    } catch (err) {
        console.error('\n--- AN ERROR OCCURRED ---');
        console.error(err);
    } finally {
        await client.close();
        console.log('>>> Disconnected from MongoDB.');
    }
}

updateQ2Records();