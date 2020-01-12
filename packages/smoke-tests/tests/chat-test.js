'use strict';

const { setUpWebDriver } = require('@faltest/lifecycle');
const assert = require('assert');

const { setupEndpoint } = require('../helpers/setup-endpoint');
const { pagesFor } = require('../helpers/pages-for');

const { users } = require('../fixtures/users');

const Home = require('../page-objects/home');
const Login = require('../page-objects/login');
const AddFriend = require('../page-objects/add-friend');
const Chat = require('../page-objects/chat');
const Setup = require('../page-objects/setup');

describe('chat', function() {
  setUpWebDriver.call(this);
  setupEndpoint.call(this);

  describe('New users can add each other and then communicate', function() {
    let a = {};
    let b = {};

    beforeEach(async function() {
      [a.home, b.home] = pagesFor.call(this, Home);
      [a.setup, b.setup] = pagesFor.call(this, Setup);
      [a.addFriend, b.addFriend] = pagesFor.call(this, AddFriend);
      [a.chat, b.chat] = pagesFor.call(this, Chat);

      await Promise.all([a.home.visit(), b.home.visit()]);
    });

    it('fresh users can begin communicating with each other', async function() {
      await Promise.all([
        a.home.beginButton.click(),
        b.home.beginButton.click(),
      ]);

      await Promise.all([
        a.setup.onboardSelf('Person A'),
        b.setup.onboardSelf('Person B'),
      ]);

      await Promise.all([a.addFriend.visit(), b.addFriend.visit()]);

      let [aInviteUrl, bInviteUrl] = await Promise.all([
        a.inviteUrl(),
        b.inviteUrl(),
      ]);

      await Promise.all([
        b.addFriend.addFriend(aInviteUrl),
        a.addFriend.addFriend(bInviteUrl),
      ]);

      await Promise.all([a.home.sidebar.open(), b.home.sidebar.open()]);

      let contacts = await a.home.sidebar.contacts.getText();
      console.log(contacts);

      // TODO:
      // open A's sidebar
      // assert that B is there
      // assert that A is in B's sidebar
      //

      // messages are the same as below
      await Promise.all([
        a.chat.sendMessage('To Person B, from Person A'),
        b.chat.sendMessage('To Person A, from Person B'),
      ]);

      // TODO: assert that the massages were received

      assert.ok(true);
    });
  });

  describe('existing users can communicate', function() {
    let one = {};
    let two = {};

    beforeEach(async function() {
      [one.home, two.home] = pagesFor.call(this, Home);
      [one.login, two.login] = pagesFor.call(this, Login);
      [one.addFriend, two.addFriend] = pagesFor.call(this, AddFriend);
      [one.chat, two.chat] = pagesFor.call(this, Chat);

      await Promise.all([one.home.visit(), two.home.visit()]);
    });

    it('users receive each others messages', async function() {
      await Promise.all([one.login.logIn(users[0]), two.login.logIn(users[1])]);

      await Promise.all([
        one.addFriend.addFriend(users[1].publicKey),
        two.addFriend.addFriend(users[0].publicKey),
      ]);

      await Promise.all([
        one.chat.sendMessage(users[0].message),
        two.chat.sendMessage(users[1].message),
      ]);

      await Promise.all([
        one.chat.waitForResponse(users[1]),
        two.chat.waitForResponse(users[0]),
      ]);

      assert.ok(true);
    });
  });
});