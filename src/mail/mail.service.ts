import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../users/models/user.model";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.API_URL}/users/activate/${user.activation_link}`;
    // console.log(url);
    await this.mailerService.sendMail({//mailer o'ziniki kk
      to: user.email,
      subject: "ChegirmaGoga xush kelibsiz",
      template: "./confirm",
      context: {
        name: user.name,
        url,
      },
    });
  }
}
