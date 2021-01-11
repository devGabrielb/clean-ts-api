import {
  Controller,
  HttpResponse,
  HttpResquest,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('Log Decorator Controller', () => {
  test('should call Controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpResquest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: {
            name: 'Gabriel',
          },
        };
        return new Promise(resolve => resolve(httpResponse));
      }
    }
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
    const httpRequest: HttpResquest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
