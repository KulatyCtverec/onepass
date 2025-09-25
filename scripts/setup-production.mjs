#!/usr/bin/env node

/**
 * Production Database Setup Script
 *
 * This script sets up database triggers after deployment.
 * Run this after your Vercel deployment is complete.
 *
 * Usage:
 *   node scripts/setup-production.mjs [deployment-url]
 *
 * Example:
 *   node scripts/setup-production.mjs https://onepass-6joobrjza-magmantyn591-8110s-projects.vercel.app
 */

const deploymentUrl =
  process.argv[2] ||
  "https://onepass-6joobrjza-magmantyn591-8110s-projects.vercel.app";

async function setupProductionDatabase() {
  console.log("🚀 Setting up production database triggers...");
  console.log(`📍 Deployment URL: ${deploymentUrl}`);

  try {
    const response = await fetch(`${deploymentUrl}/api/setup-db`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ Database triggers set up successfully!");
      console.log("📋 Result:", result.message);
    } else {
      console.error("❌ Failed to set up database triggers");
      console.error("📋 Error:", result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error calling setup endpoint:", error.message);
    process.exit(1);
  }
}

setupProductionDatabase();
