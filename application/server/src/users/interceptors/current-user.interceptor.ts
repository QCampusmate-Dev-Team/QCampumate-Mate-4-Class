/**
 * Do something to the request object:
 *  if the request has a session token attached to it
 *    find the corresponding user, set the found user(maybe null) to the request object and pass to the downstream handlers
 * 
 */ 
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { UsersService } from '../users.service'

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const { userId } = req.session || {}

    if (userId) {
      const user = await this.usersService.findOne(userId)
      req.currentUser = user
    } 

    return next.handle()
  }
}