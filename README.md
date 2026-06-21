# Simple URL Shortener
A web application that shortens long URLs into shorter, more manageable links for users to share.

## Badges
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## What it does
The Simple URL Shortener is a web application designed to shorten long URLs into shorter, more manageable links for users to share. This application utilizes Express.js, PostgreSQL, React, and Node.js to provide a seamless user experience. With features such as URL shortening, URL redirection, and link analytics, users can easily share and track their links.

## Features
* URL shortening: shorten long URLs into shorter links
* URL redirection: redirect users to the original URL when they click on the shortened link
* Link analytics: track the number of clicks on each shortened link
* User authentication: secure user accounts and link management
* Short link customization: allow users to customize their shortened links

## Requirements
* Node.js: 16.14.2
* Express.js: 4.17.1
* PostgreSQL: 14.2
* React: 17.0.2

## Installation
To install the required dependencies, run the following command:
```bash
npm install
```

## Usage
To start the application in development mode, run the following command:
```bash
npm run dev
```
Example usage:
* Shorten a URL: `curl -X POST -H "Content-Type: application/json" -d '{"url": "https://www.example.com"}' http://localhost:3000/api/shorten`
* Get the shortened URL: `curl -X GET http://localhost:3000/api/shorten`
* Redirect to the original URL: `curl -X GET http://localhost:3000/api/redirect/shortened-url`

Expected output:
* Shortened URL: `http://localhost:3000/shortened-url`
* Redirected URL: `https://www.example.com`

## Environment Variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL database connection URL |
| `PORT` | Application port number |
| `SECRET_KEY` | Secret key for user authentication |
| `NODE_ENV` | Node.js environment (development or production) |

## Project Structure
```markdown
simple-url-shortener/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── containers/
│   │   ├── index.js
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   └── README.md
├── server/
│   ├── api/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── app.js
│   ├── config/
│   ├── database/
│   ├── package.json
│   └── README.md
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Contributing
To contribute to the Simple URL Shortener project, please follow these steps:
1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Commit your changes with a descriptive message
4. Open a pull request against the main branch
5. Wait for review and approval from the maintainers

## License
The Simple URL Shortener project is licensed under the [MIT License](https://opensource.org/licenses/MIT).