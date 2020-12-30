import { InvalidParamError, MissingParamsError, ServerError } from '../errors';
import { Emailvalidator } from '../protocols';
import SignUpController from './signup';
interface SutTypes {
  sut: SignUpController;
  emailvalidatorStub: Emailvalidator;
}

const makeEmailValidator = (): Emailvalidator => {
  class EmailvalidatorStub implements Emailvalidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailvalidatorStub();
};

const makesut = (): SutTypes => {
  const emailvalidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailvalidatorStub);
  return {
    sut,
    emailvalidatorStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('password'));
  });

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(
      new MissingParamsError('passwordConfirmation'),
    );
  });

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailvalidatorStub } = makesut();
    jest.spyOn(emailvalidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call email validator with correct email', () => {
    const { sut, emailvalidatorStub } = makesut();
    const isValidSpy = jest.spyOn(emailvalidatorStub, 'isValid');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailvalidatorStub } = makesut();
    jest.spyOn(emailvalidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(500);
    expect(hhtpResponse.body).toEqual(new ServerError());
  });
});
