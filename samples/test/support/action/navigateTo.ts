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


import waitForDisplayed from '../wait/waitForDisplayed';
import LoginForm from '../selectors/LoginForm';
import OktaSignInOIE, { OktaSignInOIE as WidgetForm } from '../selectors/OktaSignInOIE';
import Home from '../selectors/Home';
import startApp from './startApp';
import { pages } from '../selectors';
import { Page } from '../selectors/Page';
import PasswordRecover from '../selectors/PasswordRecover';
import Registration from '../selectors/Registration';
import OktaSignInOIEFacebookIdp from '../selectors/OktaSignInOIEFacebookIdp';
import OktaSignInOIEOktaIdp from '../selectors/OktaSignInOIEOktaIdp';


const urls = new Map<Page, string>([
  [LoginForm, '/login'],
  [OktaSignInOIE, '/login'],
  [OktaSignInOIEFacebookIdp, '/login'],
  [OktaSignInOIEOktaIdp, '/login'],
  [Home, '/'],
  [PasswordRecover, '/recover-password'],
  [Registration, '/register'],
]);

function getContext(formName: string) {
  const page = pages[formName];
  const selector = page?.isDisplayedElementSelector;
  const url = urls.get(page);
  let queryParams = { flow: 'form' };

  if (page instanceof WidgetForm) {
    queryParams = { flow: 'widget' };
  }

  if (!selector) {
    throw new Error(`Unknown form "${formName}"`);
  }

  if (!url) {
    throw new Error(`Form "${formName}" has no associated URL`);
  }

  return { url, selector, queryParams };
}

export default async (
  userName: string,
  formName: string
) => {
  const { url, queryParams, selector } = getContext(formName);
  await startApp(url, queryParams);
  await waitForDisplayed(selector);
};
