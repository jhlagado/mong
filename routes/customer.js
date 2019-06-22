const express = require('express');
const database = {};

const mongoose = require('mongoose');
const Customer = require('../models/customer');

const db = mongoose.connect(
  'mongodb://localhost:27017/db',
  { useNewUrlParser: true }
);

const pick = (keys, object) => keys.reduce((acc, key) => {
  if (key in object) {
    acc[key] = object[key];
  }
  return acc;
}, {});

const getListRoutes = (route, model, allowedKeys) => {

  route

    .post(async (req, res) => {
      try {
        const body = pick(allowedKeys, req.body);
        const object = new model(body);
        const doc = await object.save();
        res.status(201).json(doc);
      }
      catch (err) {
        res.status(400).send(err)
      }
    })

    .get(async (req, res) => {
      try {
        const query = pick(allowedKeys, req.query);
        const doc = await model.find(query);
        res.json(doc);
      }
      catch (err) {
        res.status(400).send(err);
      }
    });
};

const getItemRoutes = (route, model, allowedKeys) => {

  route

    .all(async (req, res, next) => {
      try {
        const { id } = req.params;
        const object = await model.findById(id);
        if (object) {
          req.object = object;
          return next();
        }
        res.sendStatus(404);
      }
      catch (err) {
        next(err);
      }
    })

    .get(async (req, res) => {
      res.json(req.object);
    })

    .put(async (req, res) => {
      const { object } = req;
      const body = pick(allowedKeys, req.body);
      Object.assign(object, body);
      await object.save();
      res.json(object);
    })

    .delete(async (req, res) => {
      await req.object.delete(req.item)
      res.sendStatus(204);
    })
};

const getRouter = (model, allowedKeys) => {
  const router = express.Router();
  getListRoutes(router.route('/'), model, allowedKeys);
  getItemRoutes(router.route('/:id'), model, allowedKeys);
  return router;
}

module.exports = getRouter;
