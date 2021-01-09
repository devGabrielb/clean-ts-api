import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import env from './config/env';
MongoHelper.connect(env.mongodb.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.mongodb.port, () => {
      console.log(`rodando no http://localhost:${env.mongodb.port}`);
    });
  })
  .catch(console.error);
