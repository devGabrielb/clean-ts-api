import { MissingParamsError } from '../errors/missing-params-error';
import SignUpController from './signup';

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        PasswordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        PasswordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        PasswordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('password'));
  });
});
