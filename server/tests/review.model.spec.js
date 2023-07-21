const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Review = require('../models/Review');

describe('Review model validations', () => {
  before(() => {
    sinon.stub(mongoose.Model, 'findOne');
  });

  after(() => {
    mongoose.Model.findOne.restore();
  });

  it('should not allow buildExperience to be shorter than 50 characters', async () => {
    const shortBuildExperience = 'a'.repeat(49);
    const review = new Review({ buildExperience: shortBuildExperience });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.buildExperience.message).to.equal(
      'Build experience must be at least 50 characters long!'
    );
  });

  it('should not allow buildExperience to be longer than 550 characters', async () => {
    const longBuildExperience = 'a'.repeat(551);
    const review = new Review({ buildExperience: longBuildExperience });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.buildExperience.message).to.equal(
      'Build experience cannot be longer than 550 characters long!'
    );
  });

  it('should not allow design to be longer than 550 characters', async () => {
    const longDesign = 'a'.repeat(551);
    const review = new Review({ design: longDesign });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.design.message).to.equal(
      'Design cannot be longer than 550 characters long!'
    );
  });

  it('should not allow minifigures to be longer than 550 characters', async () => {
    const longMinifigures = 'a'.repeat(551);
    const review = new Review({ minifigures: longMinifigures });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.minifigures.message).to.equal(
      'Minifigures cannot be longer than 550 characters long!'
    );
  });

  it('should not allow value to be longer than 550 characters', async () => {
    const longValue = 'a'.repeat(551);
    const review = new Review({ value: longValue });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.value.message).to.equal(
      'Value cannot be longer than 550 characters long!'
    );
  });

  it('should not allow other to be longer than 550 characters', async () => {
    const longOther = 'a'.repeat(551);
    const review = new Review({ other: longOther });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.other.message).to.equal(
      'Other cannot be longer than 550 characters long!'
    );
  });

  it('should not allow verdict to be longer than 550 characters', async () => {
    const longVerdict = 'a'.repeat(551);
    const review = new Review({
      verdict: longVerdict,
    });

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError.errors.verdict.message).to.equal(
      'Verdict cannot be longer than 550 characters long!'
    );
  });

  it('should allow a valid review', async () => {
    const validReview = {
      buildExperience:
        'Good building experience, I really enjoyed every part of it!',
      design: 'Awesome design',
      minifigures: 'Great minifigures',
      value: 'Good value for money',
      other: 'Some other comment',
      verdict: 'Overall verdict',
      set: new mongoose.Types.ObjectId(),
    };

    const review = new Review(validReview);

    let validationError = null;
    try {
      await review.validate();
    } catch (error) {
      validationError = error;
    }

    expect(validationError).to.be.null;
  });
});
