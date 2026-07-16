import { Controller, Get, Post, Param, OnUndefined, Body, UseBefore, UseAfter, UseInterceptor, Action} from 'routing-controllers';
import 'reflect-metadata';
import { loggingAfter,loggingBefore  } from './../middleware/middleware';
import { In, Info } from './../model/in';

@Controller()
export class UserController {
    @Get('/users/:id')
    @UseBefore(loggingBefore)
    @UseAfter(loggingAfter)
    getOne (@Param('id') id: number) {
        console.log("getOne");
        return 'This action returns user #' + id;
    }


    @UseInterceptor(function (action: Action, content: any) {
        console.log('change response...');
        return content;
    })
    @UseBefore(loggingBefore)
    @UseAfter(loggingAfter)
    @Post('/users/:id')
    @OnUndefined(204)
    postOne (@Param('id') id: number, @Body() info: Info):any {
        console.log("postOne");
        console.log(JSON.stringify(info));
        console.log(info);
        return "success";
    }
}