import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamsError } from '../errors/missing-params-error';
import { badRequest, serverError } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { Emailvalidator } from '../protocols/email-validator';
import { HttpResponse, HttpResquest } from '../protocols/http';

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
      const isValid = this._emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
