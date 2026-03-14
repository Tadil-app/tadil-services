import { Twilio } from 'twilio';
import { SmsService } from '@tadil-common';

export class TwilioSmsService implements SmsService {
  private readonly _client: Twilio;

  constructor(
    accountSid: string,
    authToken: string,
    private readonly _from: string // Your Twilio phone number
  ) {
    this._client = new Twilio(accountSid, authToken);
  }

  async send(phone: string, message: string): Promise<void> {
    try {
      await this._client.messages.create({
        body: message,
        from: this._from,
        to: phone,
      });
      console.log(`SMS sent to ${phone}`);
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      // In a real app, you'd want more robust error handling
      throw new Error('Failed to send SMS.');
    }
  }
}
