export class MissingParamsError extends Error {
  constructor(paramName: String) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamsError';
  }
}
