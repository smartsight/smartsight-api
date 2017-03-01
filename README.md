<h1 align="center">
  <img src="https://github.com/smartsight/smartsight-art/raw/master/logo/variants/api/logo.png" alt="SmartSight API">
</h1>

> API for the SmartSight app

[![Build Status](https://travis-ci.org/smartsight/smartsight-api.svg?branch=dev)](https://travis-ci.org/smartsight/smartsight-api)
[![License](https://img.shields.io/badge/license-GNU-blue.svg)](LICENSE)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)

SmartSight is an [Android app](https://github.com/smartsight/smartsight-android) powered by a [deep learning engine](https://github.com/smartsight/smartsight-engine) that provides information about any object scanned by the device’s camera.

## Documentation

Please refer to our [📚 Wiki documentation](https://github.com/smartsight/smartsight-api/wiki).

## Getting started

* Clone the repo and its submodule: `git clone --recursive https://github.com/smartsight/smartsight-api.git`
* [Install Python 3](https://www.python.org/downloads/)
* Install Python requirements: `pip install -r engine/requirements.txt`
* Set your Python 3 path to run the classification script with the correct interpreter: `export PYTHONPATH=$(which python3)`
* Install Node dependencies: `npm install`
* Run the server: `npm start`
* Listening by default on: [http://localhost:3000](http://localhost:3000)

## Development setup

### Environment

| Variable         | Default   | Description                      |
|------------------|-----------|----------------------------------|
| `SM_SERVER_HOST` | "0.0.0.0" | Address of the server            |
| `SM_SERVER_PORT` | 3000      | Port of the server               |
| `PYTHONPATH`     | ""        | Path to the Python 3 interpreter |

### Commands

* Watch: `npm run dev`
* Lint: `npm run lint`
* Fix lint: `npm run lint:fix`
* Test: `npm test`

## License

GPL © SmartSight
