import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  async sendBirthdayNotification(birthdayUser) {
    if (!birthdayUser.email) return;

    await this.mailService.sendEmail(
      birthdayUser.email,
      '🎉 Feliz Aniversário!',
      `
      <h2>🎂 Feliz Aniversário, ${birthdayUser.name || 'usuário'}!</h2>
      <p>Que seu dia seja incrível 🎉</p>
      <p>Obrigado por fazer parte da nossa comunidade ❤️</p>
    `,
    );

    console.log('✅ Email enviado para o aniversariante:', birthdayUser.email);
  }
}
