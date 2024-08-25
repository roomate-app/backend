import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  const users = [
    {
      id: 1,
      name: 'John',
    },
    {
      id: 2,
      name: 'Jane',
    },
  ];
  res.json(users);
})

export default router;
