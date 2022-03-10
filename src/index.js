const { Router } = require("express");

class ShortCrud {
  constructor({
    modelObject,
    hooks = {
      beforeList,
      beforeGet,
      beforeCreate,
      beforeUpdate,
      beforeDelete,
      afterList,
      afterGet,
      afterCreate,
      afterUpdate,
      afterDelete,
    },
  }) {
    this.modelObject = modelObject;
    this.router = Router();
    this.hooks = hooks;
    Object.keys(this.hooks).forEach((key) => {
      if (!this.hooks[key]) {
        this.hooks[key] = (req, res, next) => next();
      }
    });
  }
  init() {
    this.router.get(
      "/",
      this.hooks.beforeList,
      async (req, res, next) => {
        try {
          const data = await this.modelObject.findAll();
          res.dbResponse = data;
          next();
        } catch (error) {
          return this.Message(res, {
            status: 500,
            message: "Error",
            data: error.message,
          });
        }
      },
      this.hooks.afterList
    );
    this.router.get(
      "/:id",
      this.hooks.beforeGet,
      async (req, res, next) => {
        try {
          const data = await this.modelObject.findByPk(req.params.id);
          res.dbResponse = data;
          next();
        } catch (error) {
          return this.Message(res, {
            status: 500,
            message: "Error",
            data: error.message,
          });
        }
      },
      this.hooks.afterGet
    );
    this.router.post(
      "/",
      this.hooks.beforeCreate,
      async (req, res, next) => {
        try {
          const data = await this.modelObject.create(req.body);
          res.dbResponse = data;
          next();
        } catch (error) {
          return this.Message(res, {
            status: 500,
            message: "Error",
            data: error.message,
          });
        }
      },
      this.hooks.afterCreate
    );
    this.router.patch(
      "/:id",
      this.hooks.beforeUpdate,
      async (req, res, next) => {
        try {
          const data = await this.modelObject.update(req.body, {
            where: { id: req.params.id },
          });
          res.dbResponse = data;
          next();
        } catch (error) {
          return this.Message(res, {
            status: 500,
            message: "Error",
            data: error.message,
          });
        }
      },
      this.hooks.afterUpdate
    );
    this.router.delete(
      "/:id",
      this.hooks.afterDelete,
      async (req, res, next) => {
        try {
          const data = await this.modelObject.destroy({
            where: { id: req.params.id },
          });
          res.dbResponse = data;
          next();
        } catch (error) {
          return this.Message(res, {
            status: 500,
            message: "Error",
            data: error.message,
          });
        }
      },
      this.hooks.afterDelete
    );

    return this.router;
  }
  Message(res, { status, message, data, extra }) {
    return res.status(status).json({
      message: message,
      data: data,
      ...extra,
    });
  }
}

module.exports = ShortCrud;
