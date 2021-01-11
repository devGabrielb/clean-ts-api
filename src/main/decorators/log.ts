import {
  Controller,
  HttpResponse,
  HttpResquest,
} from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly _controler: Controller;
  constructor(controller: Controller) {
    this._controler = controller;
  }
  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    await this._controler.handle(httpRequest);
    // if (httpResponse.statusCode === 500) {
    //   //log
    // }
    // return httpResponse;
    return null;
  }
}
