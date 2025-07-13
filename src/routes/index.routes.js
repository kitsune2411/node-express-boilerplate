const router = require('express').Router();
const asyncHandler = require('../utils/asyncHandler');

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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Welcome to the API!' });
  })
);

router.use('/example', require('./example.routes'));

module.exports = router;
