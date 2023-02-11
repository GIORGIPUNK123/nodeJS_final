import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('hi this is users route');
});

export = router;
