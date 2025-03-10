import { IdxAuthenticator, IdxRemediationValue } from '../types/idx-js';


export interface Credentials {
  [key: string]: string | undefined;
}

export abstract class Authenticator<Values> {
  meta: IdxAuthenticator;

  constructor(authenticator: IdxAuthenticator) {
    this.meta = authenticator;
  }

  abstract canVerify(values: Values): boolean;

  abstract mapCredentials(values: Values): Credentials;

  abstract getInputs(idxRemediationValue: IdxRemediationValue): any; // TODO: add type
}
