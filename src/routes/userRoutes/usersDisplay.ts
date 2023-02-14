import express from 'express';
import User from '../../database/seqModels/userModel';
const router = express.Router();

router.get('/', async (req, res) => {
  res.send(await User.findAll());
});
export default router;
