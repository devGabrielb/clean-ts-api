import { MissingParamsError, InvalidParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import {
  Controller,
  Emailvalidator,
  HttpResponse,
  HttpResquest,
  AddAccount,
} from './signup-protocols';

export default class SignUpController implements Controller {
  private readonly _emailValidator: Emailvalidator;
  private readonly _addAccount: AddAccount;
  constructor(emailValidator: Emailvalidator, addAccount: AddAccount) {
    this._emailValidator = emailValidator;
    this._addAccount = addAccount;
  }
  handle(httpRequest: HttpResquest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this._emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = this._addAccount.add({
        name,
        email,
        password,
      });
      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return serverError();
    }
  }
}
