import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  sendEmail(to: string, subject: string, content: string): void {
    console.log(`Email sent to ${to} with subject "${subject}": ${content}`);
  }

  notifyManager(subject: string, content: string): void {
    const managerEmails = ['manager@autoria.com'];

    for (const email of managerEmails) {
      this.sendEmail(email, subject, content);
    }
  }

  notifyAdRejection(userId: string, adId: string, reason: string): void {
    const userEmail = `user_${userId}@example.com`;

    this.sendEmail(
      userEmail,
      'Your ad has been rejected',
      `The announcement ${adId} was rejected for the following reason: ${reason}`,
    );
  }
}
