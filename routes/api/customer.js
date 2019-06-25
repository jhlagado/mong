const express = require('express');
const mongoose = require('mongoose');

const { pick } = require('../../util');

const db = mongoose.connect(
  'mongodb://localhost:27017/db',
  { useNewUrlParser: true }
);

const getRouter = (model, allowedKeys) => {

  const router = express.Router();

  router.route('/')

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

  router.route('/:id')

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

  return router;
}

module.exports = getRouter;