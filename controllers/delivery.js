const { delivery, recipe } = require("../models");

class Delivery {
  async createDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });
      if (checkUser.id != userId) {
        return res.status(401).json({ success: false, errors: ["You must have permission to delete it."] });
      }
      const { firstName, lastName, phoneNumber, address } = req.body;
      const data = await delivery.create({
        firstName,
        lastName,
        phoneNumber,
        address,
      });

      res.status(201).json({ success: true, message: ["Create delivery success!!"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getAllDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({ success: false, errors: ["You must have permission to delete it."] });
      }

      const data = await delivery.findAll({
        attributes: {
          exclude: ["createdAt", "deletedAt", "updatedAt"],
        },
      });

      if (data == null) {
        return res.status(404).json({ success: false, errors: ["Delivery not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async getDetailDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({ success: false, errors: ["You must have permission to delete it."] });
      }

      const data = await delivery.findOne({
        where: { id: req.params.id },
      });

      if (data == null) {
        return res.status(404).json({ success: false, errors: ["Delivery not found"] });
      }

      res.status(200).json({ success: true, data: data });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async updateDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const { firstName, lastName, phoneNumber, address } = req.body;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({ success: false, errors: ["You must signin first, because you don't have permission to access."] });
      }

      const updateData = await delivery.update({
        firstName,
        lastName,
        phoneNumber,
        address,
      });

      if (updateData[0] == 0) {
        return res.status(404).json({ success: false, errors: ["Delivery not found"] });
      }

      const data = await delivery.findOne({
        where: { id: req.params.id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: recipe,
            attributes: ["image", "title", "directions"],
          },
        ],
      });

      res.status(201).json({ success: true, message: ["Success update your recipe"], data: data });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }

  async deleteDelivery(req, res, next) {
    try {
      const userId = req.userData.id;
      const checkUser = await user.findOne({
        where: { id: userId },
      });

      if (checkUser.id != userId) {
        return res.status(401).json({ success: false, errors: ["You must have permission to delete it."] });
      }

      let data = await delivery.destroy({ where: { id: req.params.id } });

      if (!data) {
        return res.status(404).json({ success: false, errors: ["recipe not found"] });
      }

      res.status(201).json({ success: true, message: ["Success delete your Recipe"] });
    } catch (error) {
      res.status(500).json({ success: false, errors: ["Internal Server Error"] });
    }
  }
}

module.exports = new Delivery();
