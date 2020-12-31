import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encryptStub: Encrypter;
}

const makesut = (): SutTypes => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  const encryptStub = new EncryptStub();
  const sut = new DbAddAccount(encryptStub);

  return {
    sut,
    encryptStub,
  };
};
describe('DbAccount Usecase', () => {
  test('should call Encypter with correct password ', () => {
    const { sut, encryptStub } = makesut();
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
