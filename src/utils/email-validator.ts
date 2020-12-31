import { Emailvalidator } from '../presentation/protocols/email-validator';
export class EmailValidatorAdapter implements Emailvalidator {
  isValid(email: String): boolean {
    return false;
  }
}
