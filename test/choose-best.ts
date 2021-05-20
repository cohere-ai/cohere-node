import { expect } from 'chai';
import cohere = require('../index');
require('dotenv').config({ path: '.env.test' })
const KEY: string = process.env.API_KEY || '';

describe('The choose-best endpoint', () => {
  var response: any;
  cohere.init(KEY);
  const options = ["book", "glasses", "dog"];
  before(async () => {
    response = await cohere.chooseBest("baseline-shrimp", {
      query: "Carol picked up a book and walked to the kitchen. She set it down, picked up her glasses and left. This is in the kitchen now: ",
      options,
      mode: "APPEND_OPTION"
    });
  });
  it('Should should have a statusCode of 200', () => {
    expect(response).to.have.property('statusCode');
    expect(response.statusCode).to.equal(200);
  });
  it('Should contain a body property that contains a likelihoods property', () => {
    expect(response).to.have.property('body');
    expect(response.body).to.have.property('likelihoods');
  });
  it('Should contain a likelihoods array with a length matching the provided amount of options', () => {
    expect(response.body.likelihoods).to.be.an('array').of.length(options.length)
  });

  it('Should contain a likelihoods array containing only number values', () => {
    response.body.likelihoods.forEach((item: any) => {
      expect(item).to.be.a('number');
    });
  });
});