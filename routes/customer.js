const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb://localhost:27017/db',
  { useNewUrlParser: true }
);

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

const getRouter = (model, allowedKeys) => {

  const router = express.Router();

  router.route('/')

    .get(async (req, res) => {

      const list = await model.find({});
      res.render('customer-list', {
        title: 'Customers',
        filter: '',
        list,
      });
    })


router.route('/:id')

    .get(async (req, res) => {
      const { id } = req.params;
      const object = await model.findById(id);
      res.render('customer-edit', {
        title: 'Customer',
        val: object,
        edit: true,
      });
    })

  return router;
}

module.exports = getRouter;