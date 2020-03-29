import { Field, ArgsType, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsEmail, ValidateNested, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class SignUpInput {
  @IsEmail()
  @Field(type => String)
  email: string

  @MinLength(4)
  @Field(type => String)
  password: string

  @IsNotEmpty()
  @Field(type => String)
  firstName: string

  @IsNotEmpty()
  @Field(type => String)
  lastName: string
}

@ArgsType()
export class SignUpArgs {
  @Type(() => SignUpInput)
  @ValidateNested({each: true})
  @Field(type => SignUpInput)
  input: SignUpInput
}
