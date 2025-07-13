const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Welcome message
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Welcome to the API!
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
router.get(
  '/',
  asyncHandler(async (req, res) => success(res, null, 'Welcome to the API!'))
);

router.use('/example', require('./example.routes'));

module.exports = router;
