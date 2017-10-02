<h1 align="center">
  <img src="https://github.com/smartsight/smartsight-art/raw/master/logo/variants/api/logo.png" alt="SmartSight API">
</h1>

> API for the SmartSight app

[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](LICENSE)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Build Status](https://travis-ci.org/smartsight/smartsight-api.svg?branch=dev)](https://travis-ci.org/smartsight/smartsight-api)

SmartSight is an [Android app](https://github.com/smartsight/smartsight-android) powered by a [deep learning engine](https://github.com/smartsight/smartsight-engine) that provides information about any object scanned by the device’s camera.

## Documentation

Please refer to our [📚 Wiki documentation](https://github.com/smartsight/smartsight-api/wiki).

## Getting started

* Clone the repo and its submodule: `git clone --recursive https://github.com/smartsight/smartsight-api.git`
* [Install Python 3](https://www.python.org/downloads/)
* Install Python requirements: `pip install -r engine/requirements.txt`
* Set your Python 3 path
  * Duplicate the file `.env.sample`
  * Rename it `.env`
  * Change the `SM_PYTHON_PATH` value to your Python 3 interpreter (run `which python3` in the command line to know it)
* Install Node dependencies: `npm install`
* Run the server: `npm start`
* Listening on: `http://0.0.0.0:3000`

## Development setup

### Environment

| Variable         | Default           | Description                                 |
|------------------|-------------------|---------------------------------------------|
| `SM_SERVER_HOST` | "0.0.0.0"         | Address of the server                       |
| `SM_SERVER_PORT` | 3000              | Port of the server                          |
| `SM_MODEL_DIR`   | "/tmp/smartsight" | Directory to store the classification graph |
| `SM_PYTHON_PATH` | ""                | Path to the Python 3 interpreter            |

To change these environment variables, duplicate the file `.env.sample`, rename it `.env` and change the default values if necessary.

### Commands

* Watch: `npm run dev`
* Lint: `npm run lint`
* Fix lint: `npm run lint:fix`
* Test: `npm test`

## License

GPL © SmartSight
