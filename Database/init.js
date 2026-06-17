db = db.getSiblingDB('healthdb');

// Create collection if it doesn't exist
if (!db.getCollectionNames().includes('predictions')) {
  db.createCollection('predictions');
  print("✅ Created 'predictions' collection");
}

// Optional: Create index on user_id and timestamp for faster queries
db.predictions.createIndex({ user_id: 1, timestamp: -1 });

// Optional: Insert sample document
db.predictions.insertOne({
  user_id: "U000",
  heart_rate: 80,
  steps: 1000,
  glucose: 90,
  prediction: "Normal",
  timestamp: new Date()
});

print("✅ MongoDB initialized with sample data");
