#!/usr/bin/env node

/**
 * Environment Setup Script for Movie App
 * This script helps you switch between different Appwrite endpoints
 * based on your development environment.
 */

const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env");

const endpoints = {
  cloud: "https://cloud.appwrite.io/v1",
  "android-sim": "http://10.0.2.2:80/v1",
  "ios-sim": "http://localhost:80/v1",
  local: "http://localhost:80/v1",
};

function updateEndpoint(environment) {
  if (!endpoints[environment]) {
    console.error(`❌ Unknown environment: ${environment}`);
    console.log(`Available environments: ${Object.keys(endpoints).join(", ")}`);
    process.exit(1);
  }

  try {
    let envContent = fs.readFileSync(envPath, "utf8");

    // Update the endpoint
    const endpointRegex = /EXPO_PUBLIC_APPWRITE_ENDPOINT=.*/;
    const newEndpoint = `EXPO_PUBLIC_APPWRITE_ENDPOINT=${endpoints[environment]}`;

    if (endpointRegex.test(envContent)) {
      envContent = envContent.replace(endpointRegex, newEndpoint);
    } else {
      envContent = `${newEndpoint}\n${envContent}`;
    }

    fs.writeFileSync(envPath, envContent);

    console.log(
      `✅ Successfully updated endpoint to: ${endpoints[environment]}`
    );
    console.log(`📱 Environment: ${environment}`);

    if (environment === "android-sim") {
      console.log(`\n📋 Android Studio Simulator Setup:`);
      console.log(`   • Use 10.0.2.2 instead of localhost`);
      console.log(`   • Make sure Appwrite is running on port 80`);
    }
  } catch (error) {
    console.error(`❌ Error updating .env file:`, error.message);
    process.exit(1);
  }
}

// Get command line argument
const environment = process.argv[2];

if (!environment) {
  console.log(`🎬 Movie App Environment Setup`);
  console.log(`\nUsage: node scripts/setup-env.js <environment>`);
  console.log(`\nAvailable environments:`);
  Object.keys(endpoints).forEach((env) => {
    console.log(`  • ${env}: ${endpoints[env]}`);
  });
  console.log(`\nExamples:`);
  console.log(`  node scripts/setup-env.js cloud         # Use Appwrite Cloud`);
  console.log(
    `  node scripts/setup-env.js android-sim   # Android Studio Simulator`
  );
  console.log(`  node scripts/setup-env.js ios-sim       # iOS Simulator`);
  console.log(`  node scripts/setup-env.js local         # Local development`);
  process.exit(0);
}

updateEndpoint(environment);
