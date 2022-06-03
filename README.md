# NodeJS Simple-CRUD

This repo use for mentoring nodejs and reactjs integration api training

## Installing Sequelize CLI
```bash
 npm i -g sequelize-cli
```
## Setup Project


1. clone this project and move to project directory
2. install all the dependencies required:
```bash
npm install or yarn install
```
3. Create `.env` file (copy `.env.example` and fill it)
4. Use the sequelize-cli command to install Project :
```js
 npx sequelize-cli db:migrate
```
5. Run this Project
```js
 npm start or yarn start
```
6. Finish

##

## API Reference

#### Get all users

```http
  GET /api/users
```

| Query Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `integer` | page of data |
| `search` | `string` | search data by **email** or **firstName** |
| `sortBy` | `string` | sortBy **email** or **firstName** |
| `sort` | `string` | sort **ASC** or **DESC** |

#### Get user

```http
  GET /api/users/${uuid}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `uuid`      | `string` | **Required**. uuid of user to fetch |

#### Store user
```http
  POST /api/users
```
| Body Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstName`      | `string` | **Required**. firstName of store user |
| `lastName`      | `string` | **Required**. lastName of store user |
| `email`      | `string` | **Required**. email of store user |
| `address`      | `string` | **Required**. address of store user |
| `phone`      | `integer` | **Required**. phone of store user |

#### Update user
```http
  PUT /api/users/${uuid}
```
| Parameter | Body Parameter | Type     | Description                |
| :-------- | :-------- | :------- | :------------------------- |
| `uuid` | - | `string` | **Required**. uuid for find user |
|- | `firstName`      | `string` | **Optional**. firstName of store user |
|- | `lastName`      | `string` | **Optional**. lastName of store user |
|- | `email`      | `string` | **Optional**. email of store user |
|- | `address`      | `string` | **Optional**. address of store user |
|- | `phone`      | `integer` | **Optional**. phone of store user |

#### Delete user
```http
  DELETE /api/users/${uuid}
```
| Parameter | Body Parameter | Type     | Description                |
| :-------- | :-------- | :------- | :------------------------- |
| `uuid` | - | `string` | **Required**. uuid for find user |

## License
[MIT](https://github.com/ranggadarmajati/simple-crud/blob/main/LICENSE) 
