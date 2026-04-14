import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  // 🎂 EMAIL PARA O ANIVERSARIANTE
  async sendBirthdayNotification(user: any) {
    if (!user?.email) return;

    await this.mailService.sendEmail(
      user.email,
      '🎉 Feliz Aniversário!',
      `
        <h2>🎂 Feliz aniversário, ${user.name || 'usuário'}!</h2>
        <p>Que Deus abençoe sua vida 🙏</p>
        <p>Tenha um dia incrível 🎉</p>
      `,
    );

    console.log('🎂 Email enviado para aniversariante:', user.email);
  }

  // 📢 EMAIL PARA OS MEMBROS
  async notifyMembersAboutBirthdays(birthdayUsers: any[]) {
    if (!birthdayUsers.length) return;

    const allUsers = await this.usersService.findAll();

    const recipientEmails = allUsers
      .filter((user) => !birthdayUsers.some((b) => b.id === user.id))
      .map((user) => user.email)
      .filter(Boolean);

    if (!recipientEmails.length) return;

    const namesList = birthdayUsers.map((u) => u.name || u.email).join(', ');

    await this.mailService.sendEmail(
      recipientEmails,
      '🎉 Aniversariantes do dia!',
      `
        <h2>🎂 Temos aniversariantes hoje!</h2>
        <p>Hoje é aniversário de:</p>
        <strong>${namesList}</strong>
        <p>Envie uma mensagem de carinho ❤️</p>
      `,
    );

    console.log('📢 Email enviado para membros');
  }
}
