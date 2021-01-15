import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import {
  Controller,
  HttpResponse,
  HttpResquest,
} from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly _controler: Controller;
  private readonly _logErrorRepository: LogErrorRepository;
  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this._logErrorRepository = logErrorRepository;
    this._controler = controller;
  }
  async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
    const httpResponse = await this._controler.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this._logErrorRepository.logError(httpResponse.body.stack);
    }
    return httpResponse;
  }
}
