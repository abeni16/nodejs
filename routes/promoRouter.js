const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter
  .route("/")

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })

  .get((req, res, next) => {
    res.end("will send all the promotions to you!");
  })

  .post((req, res, next) => {
    res.end(
      "will add the promotions:" +
        req.body.name +
        " with deitals: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("put operation not supported on /promotions");
  })
  .delete((req, res, next) => {
    res.end("deleting all the promotions..");
  });

promoRouter
  .route("/:promoId")

  .get((req, res, next) => {
    res.end("will send of the promotion : " + req.params.promoId + " to you");
  })

  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("post operation not supported on /promotion/" + req.params.promoId);
  })
  .put((req, res, next) => {
    res.write("updating the promotions: " + req.params.promoId + "\n");
    res.end(
      "will update the promotion:" +
        req.body.name +
        " with deitals: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.end("deleting all the promotion..");
  });

module.exports = promoRouter;
