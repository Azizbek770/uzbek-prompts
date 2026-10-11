
const router = require('express').Router();
const Prompt = require('../models/Prompt');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

router.use(auth, admin);

// Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [users, prompts, likes, views] = await Promise.all([
      User.countDocuments(),
      Prompt.countDocuments(),
      Prompt.aggregate([
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]),
      Prompt.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ])
    ]);

    res.json({
      users,
      prompts,
      likes: likes[0]?.total || 0,
      views: views[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load statistics.' });
  }
});

// Get prompt library
router.get('/prompts', async (req, res) => {
  try {
    const prompts = await Prompt.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load prompts.' });
  }
});

// Edit prompt
router.patch('/prompts/:id', async (req, res) => {
  try {
    const allowedFields = [
      'title',
      'prompt',
      'description',
      'type',
      'category',
      'imageUrl',
      'imageSourceUrl',
      'imageAuthor',
      'imageLicense',
      'approved'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No editable fields were provided.'
      });
    }

    if (
      updates.title !== undefined &&
      (typeof updates.title !== 'string' ||
        !updates.title.trim() ||
        updates.title.trim().length > 120)
    ) {
      return res.status(400).json({
        message: 'Title is required and must be at most 120 characters.'
      });
    }

    if (
      updates.prompt !== undefined &&
      (typeof updates.prompt !== 'string' ||
        !updates.prompt.trim() ||
        updates.prompt.length > 12000)
    ) {
      return res.status(400).json({
        message: 'Prompt text is required and must be at most 12000 characters.'
      });
    }

    if (
      updates.description !== undefined &&
      (typeof updates.description !== 'string' ||
        updates.description.length > 500)
    ) {
      return res.status(400).json({
        message: 'Description must be at most 500 characters.'
      });
    }

    if (
      updates.type !== undefined &&
      !['image', 'video', 'text'].includes(updates.type)
    ) {
      return res.status(400).json({
        message: 'Type must be image, video, or text.'
      });
    }

    if (updates.category !== undefined &&
        typeof updates.category !== 'string') {
      return res.status(400).json({
        message: 'Category must be text.'
      });
    }

    for (const field of ['imageUrl', 'imageSourceUrl']) {
  if (updates[field] === undefined) continue;

  const value = updates[field];

  if (typeof value !== 'string') {
    return res.status(400).json({
      message: `${field} must be a string.`
    });
  }

  const trimmed = value.trim();

  // Allow images uploaded from the user's computer.
  if (field === 'imageUrl' && trimmed.startsWith('data:')) {
    const allowedImageData =
      /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;

    if (!allowedImageData.test(trimmed)) {
      return res.status(400).json({
        message: 'Invalid image data. Use JPEG, PNG, WEBP, or GIF.'
      });
    }

    // Limit the encoded image to approximately 7 MB.
    if (trimmed.length > 7 * 1024 * 1024) {
      return res.status(400).json({
        message: 'Image is too large. Please choose a smaller image.'
      });
    }

    updates[field] = trimmed;
    continue;
  }

  // Normal URLs must use HTTP or HTTPS.
  if (trimmed) {
    try {
      const url = new URL(trimmed);

      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol');
      }

      updates[field] = url.toString();
    } catch {
      return res.status(400).json({
        message: `${field} must be a valid HTTP or HTTPS URL.`
      });
    }
  } else {
    updates[field] = '';
  }
}

    for (const field of ['imageAuthor', 'imageLicense']) {
      if (
        updates[field] !== undefined &&
        typeof updates[field] !== 'string'
      ) {
        return res.status(400).json({
          message: `${field} must be text.`
        });
      }
    }

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    if (updates.category !== undefined) {
      updates.category = updates.category.trim() || 'Other';
    }

    const updated = await Prompt.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Prompt not found.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Edit prompt error:', error);

    res.status(500).json({
      message: 'Failed to update prompt.'
    });
  }
});

// Delete prompt
router.delete('/prompts/:id', async (req, res) => {
  try {
    const deleted = await Prompt.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Prompt not found.' });
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete prompt.' });
  }
});

module.exports = router;
