import { Controller, Get, OnUndefined, Param, UseBefore, Post, Body } from 'routing-controllers'
import 'reflect-metadata'
import { setTraceId } from '../middleware'
import { ReqBody } from '../models'

@Controller()
@UseBefore(setTraceId)
export class UserController {
  @Get('/users/:id')
  getOne (@Param('id') id: number) {
    return {
      userId: id
    }
  }

  @Post('/users/:id')
  @OnUndefined(204)
  postOne (@Param('id') id: number, @Body() body: ReqBody) {
    return {
      userId: id,
      created: true
    }
  }
}
