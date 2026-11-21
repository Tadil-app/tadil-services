import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class StaffMailService {
  private readonly logger = new Logger(StaffMailService.name);
  private transporter: Transporter | null = null;

  private configured(): boolean {
    return Boolean(
      process.env.STAFF_SMTP_HOST &&
        process.env.STAFF_SMTP_USER &&
        process.env.STAFF_SMTP_PASS
    );
  }

  private getTransporter() {
    if (!this.configured()) return null;
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.STAFF_SMTP_HOST,
        port: Number(process.env.STAFF_SMTP_PORT || 587),
        secure: process.env.STAFF_SMTP_SECURE === 'true',
        auth: {
          user: process.env.STAFF_SMTP_USER,
          pass: process.env.STAFF_SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  async sendLoginOtp(to: string, code: string) {
    const from =
      process.env.STAFF_MAIL_FROM ||
      process.env.STAFF_SMTP_USER ||
      'noreply@localhost';
    const subject = 'Your Tadil admin verification code';
    const text = [
      'Your Tadil admin verification code is:',
      '',
      code,
      '',
      'This code expires in 5 minutes. If you did not try to sign in, ignore this email.',
    ].join('\n');
    const html = `<p>Your Tadil admin verification code is:</p><p style="font-size:24px;letter-spacing:4px;font-weight:700">${code}</p><p>This code expires in 5 minutes. If you did not try to sign in, ignore this email.</p>`;

    const transporter = this.getTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV === 'production')
        throw new ServiceUnavailableException(
          'Email delivery is not configured'
        );
      // Never log the OTP itself; set STAFF_MAIL_DEV_LOG_OTP=true only on a
      // private workstation when SMTP is unavailable and you need the code.
      if (process.env.STAFF_MAIL_DEV_LOG_OTP === 'true')
        this.logger.warn(`[dev-mail] OTP for ${to}: ${code}`);
      else
        this.logger.warn(
          `[dev-mail] OTP issued for ${to} (code not logged; set STAFF_MAIL_DEV_LOG_OTP=true to print it)`
        );
      return;
    }

    try {
      await transporter.sendMail({ from, to, subject, text, html });
    } catch (error) {
      this.logger.error('Failed to send MFA email', error as Error);
      throw new ServiceUnavailableException(
        'Unable to send verification email. Try again later.'
      );
    }
  }
}
