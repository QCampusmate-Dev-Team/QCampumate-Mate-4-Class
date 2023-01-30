import {
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common'

/**
 * A ParameterDecorator to set its decoratee to the current signin-ed user
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => { // never need an argument for this decorator
    const req = context.switchToHttp().getRequest()
    console.log(req.currentUser)

    return req.currentUser
  }
)