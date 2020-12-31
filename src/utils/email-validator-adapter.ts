import validator from 'validator';
import { Emailvalidator } from '../presentation/protocols/email-validator';
export class EmailValidatorAdapter implements Emailvalidator {
  isValid(email: string): boolean {
    return validator.isEmail(email);
  }
}
