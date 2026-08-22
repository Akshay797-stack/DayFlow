import { Router, Request, Response } from 'express';
import { NotificationModel } from '../models/Notification';

const router = Router();

// GET notifications
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const filter: any = {};
    if (userId) {
      filter.$or = [{ userId: 'ALL' }, { userId }];
    }
    const notifs = await NotificationModel.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark single notification read
router.put('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notif = await NotificationModel.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ success: true, data: notif });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark all read
router.put('/read-all', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const filter: any = {};
    if (userId) {
      filter.$or = [{ userId: 'ALL' }, { userId }];
    }
    await NotificationModel.updateMany(filter, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
