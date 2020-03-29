import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { setApiKey, send } from '@sendgrid/mail'
import { User } from '../user/user.entity'

@Injectable()
export class EmailService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    setApiKey(process.env.SENDGRID_API_KEY)
  }

  private send(
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<any> {
    return send({
      to,
      from,
      subject,
      text,
      html,
    })
      .catch(err => console.log(err.response?.body))
  }

  sendEmailConfirmation(user: User): Promise<any> {
    return this.send(
      user.email,
      'no-reply@tulaco.com',
      'Welcome to tulaco!',
      `token: ${user.emailValidationToken}`,
      `<div>
        Hello ${user.firstName} ${user.lastName},<br /><br />
        This is your activation token:<br />
        ${user.emailValidationToken}
      </div>`,
    );
  }
}
