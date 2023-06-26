const { expect } = require('chai');
const { ValidationError } = require('mongoose');
const User = require('../models/User');

describe('User model validations', function () {
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
});
