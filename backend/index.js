import Fastify from "fastify";
import knexModule from "knex";
import knexConfig from "./knexfile.js";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

// Register CORS plugin
await fastify.register(fastifyCors, {
  origin: "http://localhost:3000",
  credentials: true,
});

const knex = knexModule(knexConfig.development);

// GET /emails - get all emails or search emails
fastify.get("/emails", async (request, reply) => {
  const { query } = request.query;

  try {
    let knexQuery = knex("emails")
      .select("id", "to", "cc", "bcc", "subject", "body", "created_at")
      .orderBy("created_at", "desc");

    // If query parameter exists, add search filters
    if (query && query.trim() !== "") {
      const like = `%${query}%`;
      knexQuery = knexQuery
        .whereRaw("LOWER(`to`) LIKE LOWER(?)", [like])
        .orWhereRaw("LOWER(`cc`) LIKE LOWER(?)", [like])
        .orWhereRaw("LOWER(`bcc`) LIKE LOWER(?)", [like])
        .orWhereRaw("LOWER(`subject`) LIKE LOWER(?)", [like])
        .orWhereRaw("LOWER(`body`) LIKE LOWER(?)", [like]);
    }

    const results = await knexQuery;
    return reply.send({ results });
  } catch (error) {
    console.error("Database error:", error);
    return reply.status(500).send({ error: "Database error" });
  }
});

fastify.post("/new-email", async (request, reply) => {
  const { to, cc, bcc, subject, body } = request.body;
  const now = new Date().toISOString();

  try {
    const [id] = await knex("emails").insert({
      to,
      cc,
      bcc,
      subject,
      body,
      created_at: now,
      updated_at: now,
    });
    reply.send({ id, to, cc, bcc, subject, body });
  } catch (error) {
    reply.status(500).send({ error: "Database error" });
  }
});

// Start server
fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`🚀 Server listening at ${address}`);
});
