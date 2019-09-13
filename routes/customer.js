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

    .all(async (req, res, next) => {
      const { id } = req.params;
      try {
        const object = await model.findById(id);
        if (object) {
          req.object = object;
          return next();
        }
      } catch (err) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.render('error');
      }
    })

    .get(async (req, res) => {
      const object = req.object;
      res.render('customer-edit', {
        title: 'Customer',
        val: object,
        edit: true,
      });
    })

    .post(async (req, res) => {
      const object = req.object;
      const button = req.body.button;

      if (button === 'save') {
        Object.assign(object, req.body);
        await object.save();
        req.flash('success', 'Item has been updated');

      } else if (button === 'delete') {
        await object.delete(req.item)
        req.flash('danger', 'Item has been deleted');
      }

      res.redirect('/customers');
    })

  return router;
}

module.exports = getRouter;