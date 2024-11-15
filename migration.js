// migration.js
const { createClient } = require('@supabase/supabase-js')
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


const MONGO_URI = process.env.MONGO_ATLAS_URL || 'mongodb+srv://nicolaussatria:gerobakijo333@cluster.gnwjw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

async function migrateData() {
  try {
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get all users from MongoDB
    const User = mongoose.model('User', require('./server/models/User').schema);
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users to migrate`);

    // Migrate users in batches of 50
    const batchSize = 50;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      // Transform MongoDB data to Supabase format
      const transformedData = batch.map(user => ({
        id: user._id.toString(), // Convert MongoDB _id to string
        weight: user.weight,
        height: user.height,
        education: user.education,
        family_contact: user.familyContact,
        health_questions: user.healthQuestions,
        risk_level: user.riskLevel,
        created_at: user.createdAt || new Date(),
        updated_at: user.updatedAt || new Date()
      }));

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('health_screenings')
        .upsert(transformedData, { 
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Error inserting batch:', error);
        continue;
      }

      console.log(`Migrated batch ${i/batchSize + 1}/${Math.ceil(users.length/batchSize)}`);
    }

    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    process.exit(0);
  }
}

migrateData();