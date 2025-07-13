const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const ExampleController = require('../controllers/exampleController');

/**
 * @swagger
 * tags:
 *   name: Example
 *   description: Example API endpoints
 */

/**
 * @swagger
 * /api/example/hello:
 *   get:
 *     summary: Returns a hello message
 *     tags: [Example]
 *     responses:
 *       200:
 *         description: Hello message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 */
router.get('/hello', asyncHandler(ExampleController.sayHello));

/**
 * @swagger
 * /api/example/greet/{name}:
 *   get:
 *     summary: Returns a personalized greeting
 *     tags: [Example]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name to greet
 *     responses:
 *       200:
 *         description: Greeting message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 */
router.get('/greet/:name', asyncHandler(ExampleController.greet));

/**
 * @swagger
 * /api/example/simulate-error:
 *   get:
 *     summary: Throws an error if 'fail' query param is true
 *     tags: [Example]
 *     parameters:
 *       - in: query
 *         name: fail
 *         schema:
 *           type: string
 *         required: false
 *         description: Set to 'true' to simulate an error
 *     responses:
 *       200:
 *         description: No error thrown
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseSuccess'
 *       400:
 *         description: Intentional error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseError'
 */
router.get('/simulate-error', asyncHandler(ExampleController.errorIfTrue));

module.exports = router;
