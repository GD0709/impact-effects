import express, { Express} from 'express'

//const app = express();
const port = 5000;
// app.get('/', (request, response) => {
//   response.send('Hello world!<br/>' + __dirname);
// });


import { createExpressServer, useExpressServer } from 'routing-controllers';
import { UserController } from './controller/user-controller';
import bodyParser from 'body-parser';
import httpContext from 'express-http-context';
import { GlobalErrorHandler } from './middleware/global-error-handler';

//    const app = createExpressServer({
//      controllers: [UserController], // we specify controllers we want to use
// });



const app: Express = express();
app.use(bodyParser.json());
app.use(httpContext.middleware);
 useExpressServer(app, {
   controllers: [UserController],
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false
 });


app.listen(port, () => console.log(`Running on port ${port}`));

