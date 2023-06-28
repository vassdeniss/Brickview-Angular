const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

const User = require('../models/User');

describe('User model validations', function () {
  this.timeout(20000);

  it('should require a username', async () => {
    const user = new User({ password: 'password123' });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors['username'].message).to.equal('Username is required!');
  });

  it('should require a password', async () => {
    const user = new User({ username: 'testuser' });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors['password'].message).to.equal('Password is required!');
  });

  it('should require a username with a minimum length of 4 characters', async () => {
    const user = new User({ username: 'abc', password: 'password123' });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors['username'].message).to.equal(
      'Username must be at least 4 characters long!'
    );
  });

  it('should require a password with a minimum length of 8 characters', async () => {
    const user = new User({ username: 'testuser', password: 'pass123' });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors['password'].message).to.equal(
      'Password must be at least 8 characters long!'
    );
  });

  it('should require a repeat password', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      repeatPassword: '',
    });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors['repeatPassword'].message).to.equal(
      'Repeat password is required!'
    );
  });

  it('should require the repeat password to match the password', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      repeatPassword: 'differentpassword',
    });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.exist;
    expect(error.errors['repeatPassword'].message).to.equal(
      'Password mismatch!'
    );
  });

  it('should not throw any error when data is correct', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123',
      repeatPassword: 'password123',
    });

    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    expect(error).to.not.exist;
  });

  it('should hash the password before saving', async () => {
    const plainTextPassword = 'testpassword';
    const hashedPassword = 'hashed#password';

    const bcryptStub = sinon.stub(bcrypt, 'hash').resolves(hashedPassword);

    const user = new User({
      username: 'testuser',
      password: plainTextPassword,
      repeatPassword: plainTextPassword,
    });

    await user.validate();

    expect(bcryptStub.calledOnce).to.be.true;
    expect(bcryptStub.calledWith(plainTextPassword, 10)).to.be.true;
    expect(user.password).to.equal(hashedPassword);

    sinon.restore();
  });
});
