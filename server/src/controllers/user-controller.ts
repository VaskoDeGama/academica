import { Body, Get, JsonController, OnUndefined, Param, Post } from 'routing-controllers'
import 'reflect-metadata'
import { ReqBody } from '../models'

@JsonController()
export class UserController {
  @Get('/users/:id')
  getOne (@Param('id') id: number) {
    return {
      userId: id
    }
  }

  @Post('/users/:id')
  @OnUndefined(400)
  postOne (@Param('id') id: number, @Body() body: ReqBody) {
    return {
      body,
      userId: id,
      created: true
    }
  }
}
