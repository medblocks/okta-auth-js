/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */


import { AuthenticatorData, AuthenticatorDataValues } from './Base/AuthenticatorData';

export type AuthenticatorVerificationDataValues = AuthenticatorDataValues;

export class AuthenticatorVerificationData extends AuthenticatorData {
  static remediationName = 'authenticator-verification-data';

  values!: AuthenticatorVerificationDataValues;

  mapAuthenticator() {
    // authenticator data may already be specified
    const authenticatorData = this.getAuthenticatorData();
    if (authenticatorData) {
      return authenticatorData;
    }
    
    // infer the value from the remediation
    const authenticatorFromRemediation = this.getAuthenticatorFromRemediation();
    return { 
      id: authenticatorFromRemediation.form!.value
        .find(({ name }) => name === 'id')!.value,
      enrollmentId: authenticatorFromRemediation.form!.value
        .find(({ name }) => name === 'enrollmentId')?.value,
      methodType: authenticatorData!.methodType,
    };
  }

  getInputAuthenticator() {
    const authenticator = this.getAuthenticatorFromRemediation();
    const methodType = authenticator.form!.value.find(({ name }) => name === 'methodType');
    // if has methodType in form, let user select the methodType
    if (methodType && methodType.options) {
      return { name: 'methodType', type: 'string', required: true };
    }
    // no methodType, then return form values
    const inputs = [...authenticator.form!.value];
    return inputs;
  }

  getValuesAfterProceed(): AuthenticatorVerificationDataValues {
    this.values = super.getValuesAfterProceed();
    let trimmedValues = Object.keys(this.values).filter(valueKey => valueKey !== 'authenticator');
    return trimmedValues.reduce((values, valueKey) => ({...values, [valueKey]: this.values[valueKey]}), {});
  }
}
