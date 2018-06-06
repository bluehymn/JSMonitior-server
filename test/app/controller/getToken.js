const { app, mock, assert } = require('egg-mock/bootstrap');

module.exports = function () {
  return new Promise (function (resolve, reject) {
    app.httpRequest()
      .put('/login')
      .send({
        username: 'user2',
        password: '123456'
      })
      .expect(200)
      .then(response => {
        resolve(response.body.token);
      })
  })
}