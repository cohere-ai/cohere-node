import { expect } from 'chai';
import cohere = require('../index');
require('dotenv').config({ path: '.env.test' })

describe('The embed endpoint', () => {
  var response: any;
  cohere.init(process.env.API_KEY);
  const texts = ["hello", "goodbye"];
  before(async () => {
    response = await cohere.embed("baseline-shrimp", { texts });
  });
  it('Should should have a statusCode of 200', () => {
    expect(response).to.have.property('statusCode');
    expect(response.statusCode).to.equal(200);
  });
  it('Should contain a body object that contains an embeddings property', () => {
    expect(response).to.have.property('body');
    expect(response.body).to.have.property('embeddings');
  });
  it('Should contain an embeddings array with a length matching the provided amount of embeddings', () => {
    expect(response.body.embeddings).to.be.an('array').of.length(texts.length)
  });
  it('Should contain an embeddings array containing arrays', () => {
    response.body.embeddings.forEach((item: any) => {
      expect(item).to.be.an('array');
    });
  });
});
