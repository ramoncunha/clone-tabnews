import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
    const updateAt = new Date().toISOString();
    const dbVersion = await database.query("SHOW server_version;");
    const maxConnections = await database.query("SHOW max_connections;");

    const databaseName = process.env.POSTGRES_DB;
    const usedConnections = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
      values: [databaseName],
    });

    response.status(200).json({
      updated_at: updateAt,
      dependencies: {
        database: {
          version: dbVersion.rows[0].server_version,
          max_connections: parseInt(maxConnections.rows[0].max_connections),
          opened_connections: parseInt(usedConnections.rows[0].count),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching status:", error);
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log(publicErrorObject);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

export default status;
