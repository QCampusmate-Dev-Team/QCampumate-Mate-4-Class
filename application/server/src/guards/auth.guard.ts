import {
  CanActivate,
  ExecutionContext
} from '@nestjs/common'

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    return request.session.userId // if this is a truthy value, then the request will be passed to downstream handler
  }
}