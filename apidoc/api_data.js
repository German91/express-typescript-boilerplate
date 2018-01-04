define({ "api": [
  {
    "type": "post",
    "url": "/v1/auth/login",
    "title": "Login",
    "name": "Login",
    "version": "1.0.0",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User's username (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 2xx": [
          {
            "group": "Success 2xx",
            "optional": false,
            "field": "200/OK",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 200 OK\n{\n  code: 200,\n  status: 'success',\n  user: Object(_id, email, password, username, roles, created_at, updated_at),\n  token: Auth token\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400/Bad-Request",
            "description": "<p>Invalid params</p>"
          }
        ]
      }
    },
    "filename": "build/routes/UserRouter.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/api/v1/auth/login"
      }
    ]
  },
  {
    "type": "post",
    "url": "/v1/auth/signup",
    "title": "Create a new user",
    "name": "Signup",
    "version": "1.0.0",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>User's username</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 2xx": [
          {
            "group": "Success 2xx",
            "optional": false,
            "field": "201/Created",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP 201 CREATED\n{\n  code: 201,\n  status: 'success',\n  message: 'Account successfully created',\n  user: Object(_id, email, password, username, roles, created_at, updated_at),\n  token: Auth token\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "400/Bad-Request",
            "description": "<p>Invalid params</p>"
          }
        ]
      }
    },
    "filename": "build/routes/UserRouter.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/api/v1/auth/signup"
      }
    ]
  }
] });
