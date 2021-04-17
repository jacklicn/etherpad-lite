'use strict';

const assert = require('assert').strict;
const db = require('../../../node/db/DB');
const common = require('../common');
const AuthorManager = require('../../../node/db/AuthorManager');

describe('regression test for missing await when calling db methods (#5000)', function () {
  let tmp;
  before(async function () {
    await common.init();
    tmp = db.set;
    db.set = async (...args) => {
      // delay db.set
      await new Promise((resolve) => { setTimeout(() => resolve(), 500); });
      tmp(...args);
    };
  });

  after(async function () {
    db.set = tmp;
  });

  it('createAuthor', async function () {
    this.timeout(700);
    const author = await AuthorManager.createAuthor();
    const authorFromDB = await db.get(`globalAuthor:${author.authorID}`);
    assert.ok(authorFromDB);
  });
});
