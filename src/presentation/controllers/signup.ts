import { MissingParamsError } from '../errors/missing-params-error';
import { HttpResponse, HttpResquest } from '../protocols/http';
export default class SignUpController {
  handle(httpRequest: HttpResquest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamsError('name'),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamsError('email'),
      };
    }
  }
}
