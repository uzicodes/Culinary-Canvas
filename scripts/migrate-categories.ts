/**
 * One-Time Database Migration Script
 * 
 *   2. Run: npx ts-node scripts/migrate-categories.ts
 *   
 * Or run directly with Node after compiling:
 *   npx tsc scripts/migrate-categories.ts --esModuleInterop --resolveJsonModule
 *   node scripts/migrate-categories.js
 */

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ Error: MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}

interface MigrationRule {
  /** Filter to match items (e.g., by name pattern or existing category) */
  filter: Record<string, any>;
  /** New category to assign */
  newCategory: string;
  /** Description for logging */
  description: string;
}

// Define migration rules - customize these based on your actual item names
const migrationRules: MigrationRule[] = [
  // Japanese category migrations
  {
    filter: { name: { $regex: /sushi/i } },
    newCategory: "Japanese",
    description: "Items containing 'Sushi'"
  },
  {
    filter: { name: { $regex: /ramen/i } },
    newCategory: "Japanese",
    description: "Items containing 'Ramen'"
  },
  {
    filter: { name: { $regex: /tempura/i } },
    newCategory: "Japanese",
    description: "Items containing 'Tempura'"
  },
  {
    filter: { name: { $regex: /miso/i } },
    newCategory: "Japanese",
    description: "Items containing 'Miso'"
  },
  {
    filter: { name: { $regex: /teriyaki/i } },
    newCategory: "Japanese",
    description: "Items containing 'Teriyaki'"
  },
  {
    filter: { name: { $regex: /udon/i } },
    newCategory: "Japanese",
    description: "Items containing 'Udon'"
  },

  // Sea-Food category migrations
  {
    filter: { name: { $regex: /shrimp|prawn/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Shrimp' or 'Prawn'"
  },
  {
    filter: { name: { $regex: /fish(?!.*sauce)/i } }, // Match "fish" but not "fish sauce"
    newCategory: "Sea-Food",
    description: "Items containing 'Fish'"
  },
  {
    filter: { name: { $regex: /lobster/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Lobster'"
  },
  {
    filter: { name: { $regex: /crab/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Crab'"
  },
  {
    filter: { name: { $regex: /salmon/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Salmon'"
  },
  {
    filter: { name: { $regex: /tuna/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Tuna'"
  },
  {
    filter: { name: { $regex: /calamari|squid/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Calamari' or 'Squid'"
  },
  {
    filter: { name: { $regex: /oyster/i } },
    newCategory: "Sea-Food",
    description: "Items containing 'Oyster'"
  },
];

async function runMigration() {
  const client = new MongoClient(uri!);
  
  try {
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected successfully!\n");

    const db = client.db(); // Uses database name from connection string
    const itemsCollection = db.collection("items");

    console.log("📊 Starting category migration...\n");
    console.log("=".repeat(60));

    let totalUpdated = 0;

    for (const rule of migrationRules) {
      const result = await itemsCollection.updateMany(
        rule.filter,
        { $set: { category: rule.newCategory } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ ${rule.description}`);
        console.log(`   → Updated ${result.modifiedCount} item(s) to "${rule.newCategory}"`);
        totalUpdated += result.modifiedCount;
      } else {
        console.log(`⏭️  ${rule.description}`);
        console.log(`   → No matching items found`);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`\n🎉 Migration complete! Total items updated: ${totalUpdated}`);

    // Display summary of items per category
    console.log("\n📈 Category Distribution After Migration:");
    console.log("-".repeat(40));
    
    const categoryStats = await itemsCollection.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    for (const stat of categoryStats) {
      console.log(`   ${stat._id}: ${stat.count} items`);
    }

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Database connection closed.");
  }
}

// Run the migration
runMigration();
