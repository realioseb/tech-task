import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(type => ID)
  id: string

  @Field(type => String)
  email: string

  isEmailValid: boolean = false

  emailValidationToken?: string

  password: string

  @Field(type => String)
  firstName: string

  @Field(type => String)
  lastName: string

  attempts: number = 0

  lastAttemptDate?: Date
}
