import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
  HttpResquest,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub();
};
const makeController = (): Controller => {
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
  return new ControllerStub();
};
interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};
describe('Log Decorator Controller', () => {
  test('should call Controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
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
  test('should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpResquest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Gabriel',
      },
    });
  });
  test('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve, _) => resolve(error)));
    const httpRequest: HttpResquest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
