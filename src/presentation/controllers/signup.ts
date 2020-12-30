import { MissingParamsError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import {
  Controller,
  Emailvalidator,
  HttpResponse,
  HttpResquest,
} from '../protocols';

export default class SignUpController implements Controller {
  private readonly _emailValidator: Emailvalidator;
  constructor(emailValidator: Emailvalidator) {
    this._emailValidator = emailValidator;
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
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const isValid = this._emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
