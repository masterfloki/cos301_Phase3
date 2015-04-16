var request = require('supertest')
    , express = require('express');

  var app = require('../app.js');

  // this test the web root route
  describe('Testing routes', function(){
    it('testing root', function(done){
      request(app)
        .get('/')
        .expect(200, done);
    });

    it('respond with plain text', function(done){
      request(app)
        .get('/blank')
        .expect(200, done);
    });

    it('respond with plain text', function(done){
      request(app)
        .get('/threads')
        .expect(200, done);
    });

    it('respond with plain text', function(done){
      request(app)
        .get('/testing')
        .expect(200, done);
    });

  });
