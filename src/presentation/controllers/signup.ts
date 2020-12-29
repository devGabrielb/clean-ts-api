import { MissingParamsError } from '../errors/missing-params-error';
import { badRequest } from '../helpers/http-helper';
import { HttpResponse, HttpResquest } from '../protocols/http';
export default class SignUpController {
  handle(httpRequest: HttpResquest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamsError('name'));
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamsError('email'));
    }
  }
}
