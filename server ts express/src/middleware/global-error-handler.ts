import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error (error: any, request: any, response: any, next: () => any) {
    console.log("GlobalErrorHandler");
    console.log(request);
    response.status(error.statusCode || error.httpCode).json(error);
    console.log(response);
    next();
  }
}