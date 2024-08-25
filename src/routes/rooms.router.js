import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  const {size} = req.query;
  const rooms = [];
  for (let i = 0; i < size; i++) {
    rooms.push({
      id: i,
      name: `room-${i}`,
    });
  }
  res.json(rooms);
})

router.get('/:roomId', (req, res) => {
  const {roomId} = req.params;
  res.json({
    id: roomId,
    name: `room-${roomId}`,
  });
})

router.post('/', (req, res) => {
  const {name} = req.body;
  res.json({
    id: 1,
    name,
  });
})

router.put('/:roomId', (req, res) => {
  const {roomId} = req.params;
  const {name} = req.body;
  res.json({
    id: roomId,
    name,
  });
}
)



export default router;
