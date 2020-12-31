import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

describe('DbAccount Usecase', () => {
  test('should call Encypter with correct password ', () => {
    class EncryptStub implements Encrypter {
      async encrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'));
      }
    }
    const encryptStub = new EncryptStub();
    const sut = new DbAddAccount(encryptStub);
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
