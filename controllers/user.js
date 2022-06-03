const models = require("../models")
const Sequelize = require('sequelize')
const { storeUserValidator } = require('../validator/storeUserValidator')
const { StatusCodes } = require('http-status-codes')
const Op = Sequelize.Op
const { v4: uuidv4 } = require('uuid')

const listUser = async (req, res, next) => {
    const page = req.query && req.query.page ? req.query.page : 1
    const search = req.query && req.query.search ? req.query.search : ""
    const sortBy = req.query && req.query.sortBy ? req.query.sortBy : ""
    const sort = req.query && req.query.sort ? req.query.sort : "ASC"
    let options = {
        attributes: ["uuid", "firstName", "lastName", "email", "phone", "address", "avatar"],
        page: page,
        paginate: 10,
        where: {
            deleted: 0,
            [Op.or]: {
                firstName: { [Op.like]: `%${search}%` },
                email: { [Op.like]: `%${search}%` }
            },
        }
    }
    if (sortBy) {
        options.order = [[`${sortBy}`, sort], [`id`, 'ASC']]
    }
    return models.User.paginate(options).then(resUsr => {
        let resData = { code: StatusCodes.OK, message: 'get user list successfully!', status: true }
        Object.assign(resData, resUsr)
        return res.status(StatusCodes.OK).json(resData)
    }).catch(err => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: "Something went wrong, please try again later", status: false, err })
    })
}

const storeUser = async (req, res, next) => {
    let validator = await storeUserValidator(req.body);
    if (!validator.status) {
        return res.status(StatusCodes.BAD_REQUEST).json({ code: StatusCodes.BAD_REQUEST, message: "Bad request!", status: false, docs: validator.data })
    }
    const body = validator.data;
    const t = await models.sequelize.transaction()
    await models.User.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        address: body.address,
        phone: body.phone
    }, { transaction: t }).then(async createRes => {
        t.commit()
        return res.status(StatusCodes.CREATED).json({ code: StatusCodes.CREATED, message: 'Store User successfully!', status: true, docs: createRes.dataValues })
    }).catch(e => {
        t.rollback()
        console.log("error storeUser function ::::>", e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: e?.parent?.sqlMessage || e.message, status: false })
    })
}

const detailUser = async (req, res, next) => {
    const { uuid } = req.params;
    if (!uuid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ code: StatusCodes.BAD_REQUEST, message: "uuid parameter is required!", status: false })
    }
    await models.User.findOne({ where: { uuid } }).then(r => {
        if (!r) return res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: "user not found!", status: false, docs: {} })
        return res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: "get detail user successfully!", status: true, docs: r })
    }).catch(e => {
        console.log("error detailUser :::>", e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: e.message, status: false })
    })
}

const updateUser = async (req, res, next) => {
    const { uuid } = req.params;
    if (!uuid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ code: StatusCodes.BAD_REQUEST, message: "uuid parameter is required!", status: false })
    }
    let User = await models.User.findOne({ where: { uuid } })
    if (!User) return res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: "user not found!", status: false, docs: {} })
    const t = await models.sequelize.transaction()
    await User.update(req.body, { transaction: t }).then(r => {
        t.commit()
        return res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: "update user successfully!", status: true, docs: r })
    }).catch(e => {
        t.rollback()
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: e?.parent?.sqlMessage || e.message, status: false })
    })
}

const deleteUser = async (req, res, next) => {
    const { uuid } = req.params;
    if (!uuid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ code: StatusCodes.BAD_REQUEST, message: "uuid parameter is required!", status: false })
    }
    let User = await models.User.findOne({ where: { uuid } })
    if (!User) return res.status(StatusCodes.NOT_FOUND).json({ code: StatusCodes.NOT_FOUND, message: "user not found!", status: false, docs: {} })
    const t = await models.sequelize.transaction()
    await User.update({ deleted: true, email: `${User.dataValues.id}${User.dataValues.email}` }, { transaction: t }).then(r => {
        t.commit()
        return res.status(StatusCodes.OK).json({ code: StatusCodes.OK, message: "Deleted user successfully!", status: true, docs: r })
    }).catch(e => {
        t.rollback()
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ code: StatusCodes.INTERNAL_SERVER_ERROR, message: e?.parent?.sqlMessage || e.message, status: false })
    })
}

module.exports = {
    listUser,
    storeUser,
    detailUser,
    updateUser,
    deleteUser
}