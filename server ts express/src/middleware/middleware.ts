import httpContext from 'express-http-context';

function loggingBefore (request: any, response: any, next?: (err?: any) => any): any {
  console.log('do something Before...');
  console.log('set traceId = 123');
  httpContext.set('traceId', 123);
  next();
}

function loggingAfter (request: any, response: any, next?: (err?: any) => any): any {
  console.log('do something After...');
  console.log(`tracedId = ${httpContext.get('traceId')}`);
  next();
}
export {loggingAfter, loggingBefore}