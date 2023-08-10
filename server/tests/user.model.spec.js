const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const User = require('../models/User');

describe('User model validations', function () {
  afterEach(() => {
    sinon.restore();
  });

  it('should require each field', async () => {
    // Arrange: set up user
    const user = new User({
      repeatPassword: '',
    });

    // Act: validate the user
    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    // Assert: that correct errors are thrown
    expect(error).to.exist;
    expect(error.errors['username'].message).to.equal('Username is required!');
    expect(error.errors['email'].message).to.equal('Email is required!');
    expect(error.errors['password'].message).to.equal('Password is required!');
    expect(error.errors['repeatPassword'].message).to.equal(
      'Repeat password is required!'
    );
  });

  describe('username', () => {
    it('should require a username with a minimum length of 4 characters', async () => {
      // Arrange: set up user
      const user = new User({
        username: 'abc',
        email: 'testuser@mail.com',
        password: 'password123',
      });

      sinon.stub(User, 'findOne').resolves(null);

      // Act: validate the user
      let error = null;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      // Assert: that correct error is thrown
      expect(error).to.exist;
      expect(error.errors['username'].message).to.equal(
        'Username must be at least 4 characters long!'
      );
    });

    it('should not allow a taken username', async () => {
      // Arrange: create user
      const user = new User({
        username: 'SOMEUSERNAME',
      });

      sinon.stub(User, 'findOne').resolves({
        id: 'someid',
      });

      // Act: validate the user
      let error = null;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      // Assert: that correct error is thrown
      expect(error).to.exist;
      expect(error.errors['username'].message).to.equal(
        'The username is taken!'
      );
    });
  });

  describe('email', () => {
    it('should require a valid email', async () => {
      // Arrange: set up user
      const user = new User({
        email: 'invalid-email',
      });

      // Act: validate the user
      let error = null;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      // Assert: that correct error is thrown
      expect(error).to.exist;
      expect(error.errors['email'].message).to.equal(
        'Please enter a valid email address!'
      );
    });

    it('should not allow a taken email', async () => {
      // Arrange: create user
      const user = new User({
        email: 'testuser@mail.com',
      });

      sinon.stub(User, 'findOne').resolves({
        id: 'someid',
      });

      // Act: validate the user
      let error = null;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      // Assert: that correct error is thrown
      expect(error).to.exist;
      expect(error.errors['email'].message).to.equal(
        'The email address is already in use!'
      );
    });
  });

  describe('password', () => {
    it('should require a password with a minimum length of 8 characters', async () => {
      // Arrange: set up user
      const user = new User({ password: 'pass123' });

      // Act: validate the user
      let error = null;
      try {
        await user.validate();
      } catch (err) {
        error = err;
      }

      // Assert: that correct error is thrown
      expect(error).to.exist;
      expect(error.errors['password'].message).to.equal(
        'Password must be at least 8 characters long!'
      );
    });
  });

  it('should hash the password before saving', async () => {
    // Arrange: set up user, stubs
    const plainTextPassword = 'testpassword';
    const hashedPassword = 'hashed#password';

    const bcryptStub = sinon.stub(bcrypt, 'hash').resolves(hashedPassword);

    const user = new User({
      username: 'testuser',
      email: 'validEmail@mail.com',
      password: plainTextPassword,
      repeatPassword: plainTextPassword,
    });

    sinon.stub(User, 'findOne').resolves(user);

    // Act: validate the user
    await user.validate();

    // Assert: that correct error is thrown
    expect(bcryptStub.calledOnce).to.be.true;
    expect(bcryptStub.calledWith(plainTextPassword, 10)).to.be.true;
    expect(user.password).to.equal(hashedPassword);
  });

  it('should craete normalized username before saving', async () => {
    // Arrange: set up user, stubs
    sinon.stub(bcrypt, 'hash').resolves();

    const user = new User({
      username: 'TESTUSER',
      email: 'validEmail@mail.com',
      password: 'testpassword',
      repeatPassword: 'testpassword',
    });

    sinon.stub(User, 'findOne').resolves(user);

    // Act: validate the user
    await user.validate();

    // Assert: that correct error is thrown
    expect(user.normalizedUsername).to.equal('testuser');
  });

  it('should not throw any error when data is correct', async () => {
    // Arrange: set up user
    const user = new User({
      username: 'testuser',
      email: 'validEmail@mail.com',
      password: 'password123',
      repeatPassword: 'password123',
    });

    sinon.stub(User, 'findOne').resolves(null);

    // Act: validate the user
    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    // Assert: that correct error is thrown
    expect(error).to.not.exist;
  });
});
