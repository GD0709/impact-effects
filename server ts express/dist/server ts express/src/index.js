"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
//const app = express();
var port = 5000;
// app.get('/', (request, response) => {
//   response.send('Hello world!<br/>' + __dirname);
// });
var routing_controllers_1 = require("routing-controllers");
var user_controller_1 = require("./controller/user-controller");
var body_parser_1 = __importDefault(require("body-parser"));
var express_http_context_1 = __importDefault(require("express-http-context"));
var global_error_handler_1 = require("./middleware/global-error-handler");
//    const app = createExpressServer({
//      controllers: [UserController], // we specify controllers we want to use
// });
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(express_http_context_1.default.middleware);
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [user_controller_1.UserController],
    middlewares: [global_error_handler_1.GlobalErrorHandler],
    defaultErrorHandler: false
});
app.listen(port, function () { return console.log("Running on port ".concat(port)); });
