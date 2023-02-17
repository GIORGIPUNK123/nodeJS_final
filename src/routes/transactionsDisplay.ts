import express from 'express';
import { Transaction } from '../database/seqModels/transactionsModel';
const router = express.Router();

router.get('/', async (req, res) => {
  res.send(await Transaction.findAll());
});
export default router;
