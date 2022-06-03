"use strict"
const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require('uuid')
const sequelizeSoftDelete = require("sequelize-soft-delete")
const sequelizePaginate = require("sequelize-paginate")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            uuid: DataTypes.UUID,
            firstName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    len: {
                        args: [6, 128],
                        msg: "Email address must be between 6 and 128 characters in length"
                    },
                    isEmail: {
                        args: true,
                        msg: "Email address must be valid"
                    }
                }
            },
            phone: DataTypes.STRING,
            address: DataTypes.TEXT,
            avatar: DataTypes.STRING,
            deleted: {
                type: DataTypes.INTEGER(1),
                defaultValue: 0
            }
        },
        {
            defaultScope: {
                where: {
                    deleted: 0
                }
            },
            scopes: {
                undeleted: {
                    where: {
                        deleted: false
                    }
                }
            }
        },
        {
            // freezeTableName: true,
            instanceMethods: {},
            modelName: "user"
        }
    )
    User.associate = function (models) {
        // associations can be defined here

    }

    const options = { field: "deleted", deleted: 1 }
    sequelizeSoftDelete.softDelete(User, options)
    User.beforeCreate(user => (user.uuid = uuidv4()))
    sequelizePaginate.paginate(User)
    return User
}