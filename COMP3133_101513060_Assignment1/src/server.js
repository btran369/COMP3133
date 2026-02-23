import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createHandler } from "graphql-http/lib/use/express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { connectDb } from "./config/db.js";
import { schema } from "./graphql/schema.js";
import { getUserFromAuthHeader } from "./graphql/auth.js";

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.all(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 }),

  // graphql-http rejects multipart/form-data by spec; rewrite for uploads
  (req, res, next) => {
    const ct = req.headers["content-type"] || "";
    if (ct.startsWith("multipart/form-data")) {
      req.headers["content-type"] = "application/json";
    }
    next();
  },

  createHandler({
    schema,
    graphiql: true,
    context: (req) => {
      const authHeader = req.headers.authorization || "";
      const authUser = getUserFromAuthHeader(authHeader);
      return { authUser, req };
    }
  })
);

// graphql-upload middleware 
app.use(
  "/graphql",
  graphqlUploadExpress({
    maxFileSize: 5 * 1024 * 1024, // file size in bytes
    maxFiles: 1
  })
);

// graphql-http handler
app.use(
  "/graphql",
  createHandler({
    schema,
    graphiql: true, // on for dev purpose
    context: (req) => {
      const authHeader = req.headers.authorization || "";
      const authUser = getUserFromAuthHeader(authHeader);
      return { authUser, req };
    }
  })
);

app.get("/", (_, res) => res.send("Employee Management GraphQL API is running"));

const port = Number(process.env.PORT || 4000);

await connectDb(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
});