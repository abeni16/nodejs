const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const mongoose = require("mongoose");
const Promotions = require("../models/promotions");
const cors = require("./cors");
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
promoRouter
  .route("/")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.find({})
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promo) => {
          console.log("Leader Created ", promo);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOption, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotion");
  })
  .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promoRouter
  .route("/:promoId")
  .options(cors.corsWithOption, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /promo/" + req.params.promoId);
  })
  .put(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promoId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOption, authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = promoRouter;
