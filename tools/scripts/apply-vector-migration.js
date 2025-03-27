const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

// Function to run migration given a client config
const runMigrationWithConfig = async (config) => {
  const client = new Client(config);
  try {
    await client.connect();
    const sqlPath = path.join(__dirname, "../postgres/pgvectorCreate.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    await client.query(sql);
    console.log(
      `Additional migration applied successfully with ssl: ${JSON.stringify(config.ssl)}.`,
    );
  } finally {
    await client.end();
  }
};

const runMigration = async () => {
  // Shared configuration for the client
  const baseConfig = {
    connectionString: process.env.DATABASE_URL,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };

  // First attempt with SSL enabled
  const configWithSSL = { ...baseConfig, ssl: { rejectUnauthorized: false } };
  try {
    await runMigrationWithConfig(configWithSSL);
  } catch (err) {
    if (err.message.includes("does not support SSL connections")) {
      console.warn("SSL not supported by the server, retrying migration without SSL...");
      const configNoSSL = { ...baseConfig, ssl: false };
      try {
        await runMigrationWithConfig(configNoSSL);
      } catch (err2) {
        console.error("Error applying additional migration without SSL:", err2);
        process.exit(1);
      }
    } else {
      console.error("Error applying additional migration:", err);
      process.exit(1);
    }
  }
};

runMigration().catch((err) => {
  console.error("Unexpected error during migration:", err);
  process.exit(1);
});
