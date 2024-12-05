import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updateAt,
    version: "",
    max_connections: "",
    used_connections: "",
  });
}

export default status;
