import "dotenv/config";
import app from "./app";
import { applyApollo } from "./config/graphql";

const port = Number(process.env.PORT) || 4000;


async function bootstrap() {
  await applyApollo(app);

  app.listen(port, () => {
    console.log(`REST:   http://localhost:${port}/health`);
    console.log(`GraphQL http://localhost:${port}/graphql`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});