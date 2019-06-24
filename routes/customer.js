const express = require('express');
const mongoose = require('mongoose');

const { pick } = require('../util');

const db = mongoose.connect(
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
    .post(async (req, res) => {
      const filter = (req.body.filter || '').trim();
      const terms = allowedKeys.reduce(
        (acc, key) => {
          if (filter) {
            acc.push({ [key]: filter });
          }
          return acc;
        },
        []
      );
      const query = terms.length ? { $or: terms } : {};
      const list = await model.find(query);
      res.render('customer-list', {
        title: 'Customers',
        list,
        filter,
      });
    })

  router.route('/new')
    .get(async (req, res) => {
      res.render('customer-edit', {
        title: 'Create Customer',
        val: {},
      });
    })

    .post(async (req, res) => {
      const body = pick(allowedKeys, req.body);
      const object = new model(body);
      const doc = await object.save();
      req.flash('success', 'Item has been created');
      res.redirect('/');
    })

  router.route('/filter')
    .get(async (req, res) => {
      res.render('customer-edit', {
        title: 'Filter Customers',
        val: {},
      });
    })

  router.route('/:id')

    .all(async (req, res, next) => {
      const { id } = req.params;
      const object = await model.findById(id);
      if (object) {
        req.object = object;
        return next();
      }
      res.sendStatus(404);
    })

    .get(async (req, res) => {
      res.render('customer-edit', {
        title: 'Customer',
        val: req.object,
        edit: true,
      });
    })

    .post(async (req, res) => {
      const { object } = req;
      const button = req.body.button;
      if (button === 'save') {
        const body = pick(allowedKeys, req.body);
        Object.assign(object, body);
        await object.save();
        req.flash('success', 'Item has been updated');
      }
      else if (button === 'delete') {
        await req.object.delete(req.item)
        req.flash('danger', 'Item has been deleted');
      }
      res.redirect('/');
    })

  return router;
}

module.exports = getRouter;
