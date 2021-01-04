import {
  AccountModel,
  AddAccountModel,
  Encrypter,
  AddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

const makeEncrypter = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncryptStub();
};
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'hashed_password',
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encryptStub: Encrypter;
  addAccountRepository: AddAccountRepository;
}
const makesut = (): SutTypes => {
  const encryptStub = makeEncrypter();
  const addAccountRepository = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptStub, addAccountRepository);

  return {
    sut,
    encryptStub,
    addAccountRepository,
  };
};
describe('DbAccount Usecase', () => {
  test('should call Encypter with correct password ', async () => {
    const { sut, encryptStub } = makesut();
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
  test('should throw if Encypter throws ', async () => {
    const { sut, encryptStub } = makesut();
    jest
      .spyOn(encryptStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('should call AddAccountRepository with correct values ', async () => {
    const { sut, addAccountRepository } = makesut();
    const addSpy = jest.spyOn(addAccountRepository, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('should throw if AddAccountRepository throws ', async () => {
    const { sut, addAccountRepository } = makesut();
    jest
      .spyOn(addAccountRepository, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('should return an account  Aon succcess ', async () => {
    const { sut } = makesut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });
});
