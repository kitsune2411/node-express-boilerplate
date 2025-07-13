const { success } = require('../utils/apiResponse');

/**
 * ExampleController class for handling example routes.
 */
class ExampleController {
  /**
   * GET /api/hello
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async sayHello(req, res) {
    return success(res, null, 'Hello from ExampleController!');
  }

  /**
   * GET /api/greet/:name
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async greet(req, res) {
    const { name } = req.params;
    return success(res, null, `Hello, ${name}!`);
  }

  /**
   * GET /api/error-if-true
   * Throws an error if the 'fail' query param is true.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async errorIfTrue(req, res) {
    const { fail } = req.query;
    if (fail === 'true') {
      const error = new Error("Intentional error triggered by 'fail' query param.");
      error.status = 400; // Bad Request
      error.code = 'INTENTIONAL_ERROR';
      throw error; // This will be caught by asyncHandler and passed to the error handler
    }

    return success(res, null, 'No error thrown.');
  }
}

module.exports = ExampleController;
