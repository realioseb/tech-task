import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from '../user/user.entity'
import { GqlAuthGuard } from './gql-auth.guard'
import { CurrentUser } from './current-user.decorator'
import { SignUpArgs } from './dto/sign-up.args'
import { AuthService } from './auth.service'
import { LoginArgs } from './dto/login.args'
import { VerifyEmailArgs } from './dto/verify-email.args'

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Mutation(returns => Boolean)
  async signup(@Args() signUpArgs: SignUpArgs): Promise<boolean> {
    const { email, password, firstName, lastName } = signUpArgs.input

    return this.authService.signUp(
      email,
      password,
      firstName,
      lastName,
    )
  }

  @Mutation(returns => String)
  login(@Args() loginArgs: LoginArgs): Promise<string> {
    return this.authService.login(loginArgs.email, loginArgs.password)
  }

  @Mutation(returns => Boolean)
  async verifyEmail(@Args() verifyEmailArgs: VerifyEmailArgs): Promise<boolean> {
    return this.authService.verifyEmail(verifyEmailArgs.token)
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => User)
  me(@CurrentUser() currentUser: User): Promise<User> {
    return this.authService.getUser(currentUser.id)
  }
}
