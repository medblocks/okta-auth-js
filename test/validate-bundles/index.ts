// eslint-disable-next-line node/no-extraneous-import
import { jest } from '@jest/globals';
import Cookies from 'js-cookie';
import Emitter from 'tiny-emitter';
import PCancelable from 'p-cancelable';
import { OktaAuth } from '@okta/okta-auth-js';

describe('OktaAuth (api)', function() {
  let auth;
  let issuer;

  beforeEach(function() {
    issuer =  'http://my-okta-domain';
    auth = new OktaAuth({ issuer, pkce: false });
  });

  it('is a valid constructor', function() {
    expect(auth instanceof OktaAuth).toBe(true);
    expect(auth.emitter).toBeInstanceOf(Emitter);
  });

  it('can updateAuthState', () => {
    auth.authStateManager.updateAuthState();
    expect(auth.authStateManager._pending.updateAuthStatePromise).toBeInstanceOf(PCancelable);
  });

  describe('js-cookie', () => {
    it('get', () => {
      jest.spyOn(Cookies, 'get');
      auth.options.storageUtil.storage.get();
      expect(Cookies.get).toHaveBeenCalled();
      
    });
    it('set', () => {
      jest.spyOn(Cookies, 'set');
      auth.options.storageUtil.storage.set('fakekey', 'fakevalue', '1644877195617', { secure: true, sameSite: 'none' });
      expect(Cookies.set).toHaveBeenCalledWith('fakekey', 'fakevalue', { 
        path: '/', 
        sameSite: 'none', 
        secure: true 
      });
    });
    it('remove', () => {
      jest.spyOn(Cookies, 'remove');
      auth.options.storageUtil.storage.delete('fakekey');
      expect(Cookies.remove).toHaveBeenCalledWith('fakekey', { path: '/' });
    });
  });
  
});