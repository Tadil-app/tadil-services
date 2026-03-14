export interface SmsService {
  send(phone: string, message: string): Promise<void>;
}
