import { Field, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class LoginArgs {
  @Field(type => String)
  email: string

  @Field(type => String)
  password: string
}
