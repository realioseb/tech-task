import { Field, ArgsType } from '@nestjs/graphql'
import { IsAlphanumeric } from 'class-validator'

@ArgsType()
export class VerifyEmailArgs {
  @Field(type => String)
  token: string
}
