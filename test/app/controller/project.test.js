'use strict';

const { app, mock, assert } = require('egg-mock/bootstrap');
const getToken = require('./getToken')

describe('test/app/controller/project.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /project', async () => {
    app.mockCsrf();
    const token = await getToken();
    return app.httpRequest()
      .get('/project')
      .set( 'x-token', token)
      // .expect('hi, egg')
      .expect(200)
      .then(response => {
        assert(response.body.length === 0)
      })
  });
});
