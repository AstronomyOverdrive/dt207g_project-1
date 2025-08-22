# DT207G Project API
## About
REST API powered by [Express](https://www.npmjs.com/package/express).<br>
This API handles restaurant menus, about page information and orders as well as staff accounts.<br>
A user [frontend](https://github.com/AstronomyOverdrive/dt207g_project-3) for it is also available.<br>
As well as a staff [frontend](https://github.com/AstronomyOverdrive/dt207g_project-2).
## Installation
### Install server
```sh
git clone https://github.com/AstronomyOverdrive/dt207g_project-1.git &&
cd dt207g_project-1 &&
npm install
```
This will also pull in the following packages:
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [CORS](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Express](https://www.npmjs.com/package/express)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose](https://www.npmjs.com/package/mongoose)

### Setup database
```sh
node install.js
```
This will also create an admin user, fill the database with a few menu items and add a description.<br>
*NOTE: You will also need to setup a MongoDB server.*

## Usage
### Start the server
```sh
node server.js
```
After starting the server you can access the API at: [http://0.0.0.0:8000/](http://0.0.0.0:8000/)

### Staff endpoints
|Action           |Method |Endpoint                 |Body                                                                          |Header                                     |
|-----------------|-------|-------------------------|------------------------------------------------------------------------------|-------------------------------------------|
|Login user       |POST   |/staff/user/login        |{"username": "Name", "password": "Password"}                                  |                                           |
|Register user    |POST   |**/staff/user/register** |{"username": "Name", "password": "Password", "admin": false}                  |{"Authorization": "Bearer JSON.Web.Token"} |
|Delete user      |DELETE |**/staff/user/delete**   |{"username": "Name"}                                                          |{"Authorization": "Bearer JSON.Web.Token"} |
|Get orders       |GET    |/staff/orders/get        |                                                                              |{"Authorization": "Bearer JSON.Web.Token"} |
|Mark order done  |PUT    |/staff/orders/done       |{"id": "order_id"}                                                            |{"Authorization": "Bearer JSON.Web.Token"} |
|Delete order     |DELETE |**/staff/orders/delete** |{"id": "order_id"}                                                            |{"Authorization": "Bearer JSON.Web.Token"} |
|Add menu item    |POST   |**/staff/menu/add**      |{"name": "Name", "description": "Description", "price": 200}                  |{"Authorization": "Bearer JSON.Web.Token"} |
|Update menu item |PUT    |**/staff/menu/edit**     |{"name": "Name", "description": "Description", "price": 200, "id": "item_id"} |{"Authorization": "Bearer JSON.Web.Token"} |
|Delete menu item |DELETE |**/staff/menu/delete**   |{"id": "order_id"}                                                            |{"Authorization": "Bearer JSON.Web.Token"} |
|Update about     |PUT    |**/staff/about/edit**    |{"about": "Description"}                                                |{"Authorization": "Bearer JSON.Web.Token"} |

*NOTE:* ***Bold paths*** *require user to be flagged as admin.*<br>
*NOTE: Username must be between 5-25 characters*<br>
*NOTE: Item name can be max 25 characters and description 120 characters*<br>

### Public endpoints
|Action      |Method |Endpoint            |Body                                                                                 |Header |
|------------|-------|--------------------|-------------------------------------------------------------------------------------|-------|
|Read menu   |GET    |/public/menu        |                                                                                     |       |
|Read about  |GET    |/public/about       |                                                                                     |       |
|Read order  |POST   |/public/order/find  |{"id": "order_id"}                                                                   |       |
|Place order |POST   |/public/order/place |{"items": ["item1_id", "item2_id"], "name": "Customer name", "phone", "0707070707"}  |       |

### Successful response codes (and useful body items)
#### /staff:
**POST /staff/user/login**<br>
HTTP Status 200<br>
```
[
	{
		message: 'Login successful',
		token: 'JSON.Web.Token'
	}
]
```

**POST /staff/user/register**<br>
HTTP Status 201<br>

**DELETE /staff/user/delete**<br>
HTTP Status 200<br>

**GET /staff/orders/get**<br>
HTTP Status 200<br>
```
[
	{
		_id: 'abc123',
		items: [ 'menuitem1_id', 'menuitem2_id' ],
		customerName: 'Name',
		customerPhone: '0707070707',
		completed: false,
		createdAt: '2025-08-20T23:09:02.657Z',
		updatedAt: '2025-08-20T23:09:02.657Z',
		__v: 0
	},
	...
]
```

**PUT /staff/orders/done**<br>
HTTP Status 200<br>

**DELETE /staff/orders/delete**<br>
HTTP Status 200<br>

**POST /staff/menu/add**<br>
HTTP Status 201<br>

**PUT /staff/menu/edit**<br>
HTTP Status 200<br>

**DELETE /staff/menu/delete**<br>
HTTP Status 200<br>

**PUT /staff/about/edit**<br>
HTTP Status 200<br>

#### /public:
**GET /public/menu**<br>
HTTP Status 200<br>
```
[
	{
		_id: 'abc123',
		name: 'Dish name',
		description: 'Dish description',
		price: 215,
		__v: 0
	},
	...
]
```

**GET /public/about**<br>
HTTP Status 200<br>
```
[
	{
		_id: 'abc123',
		description: 'Restaurant description',
		__v: 0
	}
]
```

**POST /public/order/find**<br>
HTTP Status 200<br>
```
[
	{
		_id: 'abc123',
		items: [ 'menuitem1_id', 'menuitem2_id' ],
		customerName: 'Name',
		customerPhone: '0707070707',
		completed: false,
		createdAt: '2025-08-20T23:09:02.657Z',
		updatedAt: '2025-08-20T23:09:02.657Z',
		__v: 0
	}
]
```

**POST /public/order/place**<br>
HTTP Status 201<br>

### Error response codes
The body format for all 4XX and 500 responses is:
```
	{ message: 'Error message' }
```
#### /staff
**POST /staff/user/login**<br>
HTTP Status 401<br>
HTTP Status 404<br>
HTTP Status 500<br>

**POST /staff/user/register**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 409<br>
HTTP Status 500<br>

**DELETE /staff/user/delete**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**GET /staff/orders/get**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**PUT /staff/orders/done**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**DELETE /staff/orders/delete**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**POST /staff/menu/add**<br>
HTTP Status 400<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**PUT /staff/menu/edit**<br>
HTTP Status 400<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**DELETE /staff/menu/delete**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

**PUT /staff/about/edit**<br>
HTTP Status 401<br>
HTTP Status 403<br>
HTTP Status 500<br>

#### /public
**GET /public/menu**<br>
HTTP Status 500<br>

**GET /public/about**<br>
HTTP Status 500<br>

**POST /public/order/find**<br>
HTTP Status 500<br>

**POST /public/order/place**<br>
HTTP Status 400<br>
HTTP Status 500<br>
