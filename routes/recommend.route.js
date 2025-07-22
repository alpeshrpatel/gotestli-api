module.exports = app => {
    const Recommend = require('../controller/recommend.controller');

    var router = require('express').Router();

   router.post('/quizzes',Recommend.getQuizzes);

   router.post('/users',Recommend.getUsers);

   router.post('/update/collections',Recommend.updateUserCollection);


    app.use('/api/recommend',router)

};