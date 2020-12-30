import {
  AddAccount,
  AddAccountModel,
  Emailvalidator,
  AccountModel,
} from './signup-protocols';

import {
  InvalidParamError,
  MissingParamsError,
  ServerError,
} from '../../errors';

import SignUpController from './signup';

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountStub();
};
const makeEmailValidator = (): Emailvalidator => {
  class EmailvalidatorStub implements Emailvalidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailvalidatorStub();
};

interface SutTypes {
  sut: SignUpController;
  emailvalidatorStub: Emailvalidator;
  addAccountStub: AddAccount;
}
const makesut = (): SutTypes => {
  const emailvalidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailvalidatorStub, addAccountStub);
  return {
    sut,
    emailvalidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('email'));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new MissingParamsError('password'));
  });

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation'),
    );
  });

  test('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(
      new MissingParamsError('passwordConfirmation'),
    );
  });

  test('Should return 400 if an invalid email is provided', async () => {
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
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(400);
    expect(hhtpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call email validator with correct email', async () => {
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
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
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
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(500);
    expect(hhtpResponse.body).toEqual(new ServerError());
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makesut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makesut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(500);
    expect(hhtpResponse.body).toEqual(new ServerError());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makesut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    };
    const hhtpResponse = await sut.handle(httpRequest);
    expect(hhtpResponse.statusCode).toBe(200);
    expect(hhtpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    });
  });
});
