const router = require('express').Router();
const Prompt = require('../models/Prompt');
const User = require('../models/User');
const { auth } = require('../middleware/auth');


// =========================================================
// GET ALL PROMPTS
// =========================================================
router.get('/', async (req, res) => {
  try {
    const {
      q,
      type,
      category,
      sort = 'newest'
    } = req.query;

    let f = {
      approved: true
    };

    if (type && type !== 'all') {
      f.type = type;
    }

    if (category && category !== 'all') {
      f.category = category;
    }

    if (q) {
      const safe = String(q).replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      f.$or = [
        {
          title: new RegExp(safe, 'i')
        },
        {
          prompt: new RegExp(safe, 'i')
        },
        {
          description: new RegExp(safe, 'i')
        },
        {
          category: new RegExp(safe, 'i')
        }
      ];
    }

    const order =
      sort === 'popular'
        ? { likes: -1, views: -1 }
        : sort === 'views'
        ? { views: -1 }
        : sort === 'oldest'
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const data = await Prompt.find(f)
      .populate('author', 'name')
      .sort(order)
      .limit(200);

    let likedSet = new Set();

    try {
      const header = req.headers.authorization || '';

      if (header.startsWith('Bearer ')) {
        const jwt = require('jsonwebtoken');

        const payload = jwt.verify(
          header.slice(7),
          process.env.JWT_SECRET
        );

        const u = await User.findById(payload.id)
          .select('likedPrompts');

        if (u) {
          likedSet = new Set(
            (u.likedPrompts || []).map(id => id.toString())
          );
        }
      }
    } catch (e) {
      // Ignore invalid or expired token
    }

    res.json(
      data.map(p => {
        const obj = p.toObject();

        obj.liked = likedSet.has(
          p._id.toString()
        );

        return obj;
      })
    );

  } catch (e) {
    console.error('GET PROMPTS ERROR:', e);

    res.status(500).json({
      message: 'Could not load prompts.'
    });
  }
});


// =========================================================
// GET MY PROMPTS
// =========================================================
router.get('/mine', auth, async (req, res) => {
  try {
    const data = await Prompt.find({
      author: req.user._id
    })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(data);

  } catch (e) {
    console.error('GET MY PROMPTS ERROR:', e);

    res.status(500).json({
      message: 'Could not load your prompts.'
    });
  }
});


// =========================================================
// ADMIN CREATE PROMPT
// =========================================================
router.post('/admin/create', auth, async (req, res) => {
  try {

    // Check admin permission
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access required.'
      });
    }

    const title = String(
      req.body.title || ''
    ).trim();

    const prompt = String(
      req.body.prompt || ''
    ).trim();

    const description = String(
      req.body.description || ''
    ).trim();

    const type = String(
      req.body.type || ''
    ).trim();

    const category = String(
      req.body.category || 'Other'
    ).trim();

    const imageUrl = String(
      req.body.imageUrl ||
      req.body.image_url ||
      ''
    ).trim();


    // Required fields
    if (!title || !prompt) {
      return res.status(400).json({
        message: 'Title and prompt are required.'
      });
    }


    // Create prompt
    const newPrompt = await Prompt.create({
      title,
      prompt,
      description,
      type,
      category,
      imageUrl,
      author: req.user._id,
      approved: true
    });


    // Populate author
    const result = await newPrompt.populate(
      'author',
      'name'
    );


    res.status(201).json(result);

  } catch (e) {

    console.error(
      'ADMIN CREATE PROMPT ERROR:',
      e
    );

    res.status(500).json({
      message: 'Could not create prompt.'
    });
  }
});


// =========================================================
// ADMIN UPDATE PROMPT
// =========================================================
router.put('/admin/:id', auth, async (req, res) => {
  try {

    // Check admin permission
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access required.'
      });
    }


    // Find prompt
    const p = await Prompt.findById(
      req.params.id
    );


    if (!p) {
      return res.status(404).json({
        message: 'Prompt not found.'
      });
    }


    // Get fields
    const title = String(
      req.body.title || ''
    ).trim();

    const prompt = String(
      req.body.prompt || ''
    ).trim();

    const description = String(
      req.body.description || ''
    ).trim();

    const type = String(
      req.body.type || ''
    ).trim();

    const category = String(
      req.body.category || 'Other'
    ).trim();

    const imageUrl = String(
      req.body.imageUrl ||
      req.body.image_url ||
      ''
    ).trim();


    // Required fields
    if (!title || !prompt) {
      return res.status(400).json({
        message: 'Title and prompt are required.'
      });
    }


    // Update fields
    p.title = title;
    p.prompt = prompt;
    p.description = description;
    p.type = type;
    p.category = category;
    p.imageUrl = imageUrl;


    // Save
    await p.save();


    // Populate author
    const result = await p.populate(
      'author',
      'name'
    );


    res.json(result);

  } catch (e) {

    console.error(
      'ADMIN UPDATE PROMPT ERROR:',
      e
    );

    res.status(500).json({
      message: 'Could not update prompt.'
    });
  }
});


// =========================================================
// PUBLISH PROMPT
// =========================================================
router.post('/', auth, async (req, res) => {
  try {

    const title = String(
      req.body.title || ''
    ).trim();

    const prompt = String(
      req.body.prompt || ''
    ).trim();

    const description = String(
      req.body.description || ''
    ).trim();

    const type = req.body.type;

    const category = String(
      req.body.category || 'Other'
    ).trim();

    const imageUrl = String(
      req.body.imageUrl || ''
    ).trim();


    // Required fields
    if (!title || !prompt) {
      return res.status(400).json({
        message: 'Title and prompt are required.'
      });
    }


    // Create prompt
    const p = await Prompt.create({
      title,
      prompt,
      description,
      type,
      category,
      imageUrl,
      author: req.user._id,
      approved: true
    });


    // Populate author
    res.status(201).json(
      await p.populate(
        'author',
        'name'
      )
    );

  } catch (e) {

    console.error(
      'PUBLISH PROMPT ERROR:',
      e
    );

    res.status(500).json({
      message: 'Could not publish the prompt.'
    });
  }
});


// =========================================================
// ADD VIEW
// =========================================================
router.post('/:id/view', async (req, res) => {
  try {

    await Prompt.findByIdAndUpdate(
      req.params.id,
      {
        $inc: {
          views: 1
        }
      }
    );

    res.json({
      ok: true
    });

  } catch (e) {

    res.status(404).json({
      message: 'Prompt not found.'
    });
  }
});


// =========================================================
// LIKE / UNLIKE PROMPT
// =========================================================
router.post('/:id/like', auth, async (req, res) => {
  try {

    const p = await Prompt.findById(
      req.params.id
    );

    const u = await User.findById(
      req.user._id
    );


    if (!p) {
      return res.status(404).json({
        message: 'Prompt not found.'
      });
    }


    if (!u) {
      return res.status(401).json({
        message: 'User not found.'
      });
    }


    if (!Array.isArray(u.likedPrompts)) {
      u.likedPrompts = [];
    }


    const has = u.likedPrompts.some(
      x =>
        x.toString() ===
        p._id.toString()
    );


    if (has) {

      u.likedPrompts =
        u.likedPrompts.filter(
          x =>
            x.toString() !==
            p._id.toString()
        );

      p.likes = Math.max(
        0,
        p.likes - 1
      );

    } else {

      u.likedPrompts.push(
        p._id
      );

      p.likes++;
    }


    await Promise.all([
      u.save(),
      p.save()
    ]);


    res.json({
      likes: p.likes,
      liked: !has
    });

  } catch (e) {

    console.error(
      'LIKE PROMPT ERROR:',
      e
    );

    res.status(500).json({
      message: 'Could not update like.'
    });
  }
});


// =========================================================
// FAVORITE / UNFAVORITE PROMPT
// =========================================================
router.post(
  '/:id/favorite',
  auth,
  async (req, res) => {

    try {

      const u = await User.findById(
        req.user._id
      );

      const id = req.params.id;


      const has = u.favorites.some(
        x =>
          x.toString() === id
      );


      if (has) {

        u.favorites =
          u.favorites.filter(
            x =>
              x.toString() !== id
          );

      } else {

        u.favorites.push(id);
      }


      await u.save();


      res.json({
        favorite: !has
      });

    } catch (e) {

      console.error(
        'FAVORITE ERROR:',
        e
      );

      res.status(500).json({
        message:
          'Could not update favorite.'
      });
    }
  }
);


// =========================================================
// DELETE PROMPT
// =========================================================
router.delete(
  '/:id',
  auth,
  async (req, res) => {

    try {

      const p = await Prompt.findById(
        req.params.id
      );


      if (!p) {
        return res.status(404).json({
          message: 'Prompt not found.'
        });
      }


      // Owner or admin can delete
      if (
        p.author?.toString() !==
          req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          message:
            'You do not have permission.'
        });
      }


      await p.deleteOne();


      res.json({
        ok: true
      });

    } catch (e) {

      console.error(
        'DELETE PROMPT ERROR:',
        e
      );

      res.status(500).json({
        message:
          'Could not delete prompt.'
      });
    }
  }
);


// =========================================================
// EXPORT ROUTER
// =========================================================
module.exports = router;
