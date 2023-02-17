import express from 'express';
import User from '../../database/seqModels/userModel';
const router = express.Router();

router.get('/', async (req, res) => {
  res.send(
    await User.findAll({
      where: {
        is_deleted: false,
      },
    })
  );
});
export default router;
