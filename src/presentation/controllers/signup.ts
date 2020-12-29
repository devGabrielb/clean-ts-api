import { MissingParamsError } from '../errors/missing-params-error';
import { badRequest } from '../helpers/http-helper';
import { HttpResponse, HttpResquest } from '../protocols/http';
export default class SignUpController {
  handle(httpRequest: HttpResquest): HttpResponse {
    const requiredFields = ['name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field));
      }
    }
  }
}
