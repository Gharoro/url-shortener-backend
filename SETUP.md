# URL Shortener API Setup Guide

This readme provides a setup guide to get the Nest.js backend running locally.

## Description

Application was built in Nest.js due to its Typescript support and modular architecture. An in memory
storage was used as required by the assessment. Unit and e2e test were sufficiently covered. API documentation
available as a Swagger doc.

## First step, clone the github repository

```bash
$ git clone https://github.com/Gharoro/url-shortener-backend.git
$ cd url-shortener-backend
```

## Project setup

In the root of project, run the command below to install all necessary dependencies

```bash
$ npm install
```

## Add .env

Create a .env file in the root of the project folder and add the following variables

```bash
$ PORT = 2025
$ DOMAIN = 'http://localhost:2025'
```

You can update the PORT to your preferred choice.

## Run the project

Execute the command below to start the project locally and keep it running

```bash
$ npm run start:dev
```

## API Docs

While the application is running, visit the following URL on your browser for the API docs

[http://localhost:2025/api-docs](http://localhost:2025/api-docs)

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## View Test Report

To view test coverage report, look for the following file from the root directory. Open html file in browser.

```bash
$ coverage/lcov-report/index.html
```
