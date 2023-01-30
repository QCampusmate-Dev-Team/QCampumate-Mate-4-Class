import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'

interface ClassConstructor {
  new (...args: any[]) : {}
}

/**
 * @param dto 
 * @returns a MethodDecorator or ClassDecorator based on context, which applies the serialization specified by dto  
 */
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializerInterceptor(dto))
}

export class SerializerInterceptor implements NestInterceptor { // check the class properly implements NestInterceptor
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something before a request is handled 
    // by the request handler
    // console.log("before")

    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        })
      })
    )
  }
}
