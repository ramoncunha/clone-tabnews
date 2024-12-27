import database from "infra/database.js";

async function status(request, response) {
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
}

export default status;
