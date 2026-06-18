const express = require('express');
const router = express.Router();
const pool = require('../db');
const sqliteHelper = require('../sqlite');

router.get('/', async (req, res) => {
	try {
		if (process.env.DB_TYPE === 'mysql') {
			const [rows] = await pool.query('SELECT id, title, description, url, tags FROM projects ORDER BY id DESC');
			const projects = rows.map(r => ({
				id: r.id,
				title: r.title,
				description: r.description,
				url: r.url,
				tags: (() => { try { return JSON.parse(r.tags); } catch(e) { return []; } })(),
			}));
			return res.json(projects);
		}

		// default: sqlite
		const db = await sqliteHelper.getDb();
		const rows = await db.all('SELECT id, title, description, url, tags FROM projects ORDER BY id DESC');
		const projects = rows.map(r => ({
			id: r.id,
			title: r.title,
			description: r.description,
			url: r.url,
			tags: (() => { try { return JSON.parse(r.tags); } catch(e) { return []; } })(),
		}));
		return res.json(projects);
	} catch (err) {
		console.error('DB error fetching projects', err);
		return res.status(500).json({ error: 'Failed to fetch projects' });
	}
});

module.exports = router;

const requireAdmin = require('../middleware/auth');

// Create a new project (admin only)
router.post('/', requireAdmin, async (req, res) => {
	const { title, description, url, tags } = req.body;
	if (!title) return res.status(400).json({ error: 'title required' });
	try {
		if (process.env.DB_TYPE === 'mysql') {
			const [result] = await pool.query('INSERT INTO projects (title, description, url, tags) VALUES (?, ?, ?, ?)', [title, description || '', url || '', JSON.stringify(tags || [])]);
			return res.status(201).json({ id: result.insertId });
		}
		const db = await sqliteHelper.getDb();
		const result = await db.run('INSERT INTO projects (title, description, url, tags) VALUES (?,?,?,?)', title, description || '', url || '', JSON.stringify(tags || []));
		return res.status(201).json({ id: result.lastID });
	} catch (err) {
		console.error('Error creating project', err);
		return res.status(500).json({ error: 'Failed to create project' });
	}
});

// Update a project (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
	const id = req.params.id;
	const { title, description, url, tags } = req.body;
	try {
		if (process.env.DB_TYPE === 'mysql') {
			await pool.query('UPDATE projects SET title=?, description=?, url=?, tags=? WHERE id=?', [title, description || '', url || '', JSON.stringify(tags || []), id]);
			return res.json({ ok: true });
		}
		const db = await sqliteHelper.getDb();
		await db.run('UPDATE projects SET title=?, description=?, url=?, tags=? WHERE id=?', title, description || '', url || '', JSON.stringify(tags || []), id);
		return res.json({ ok: true });
	} catch (err) {
		console.error('Error updating project', err);
		return res.status(500).json({ error: 'Failed to update project' });
	}
});

// Delete a project (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
	const id = req.params.id;
	try {
		if (process.env.DB_TYPE === 'mysql') {
			await pool.query('DELETE FROM projects WHERE id=?', [id]);
			return res.json({ ok: true });
		}
		const db = await sqliteHelper.getDb();
		await db.run('DELETE FROM projects WHERE id=?', id);
		return res.json({ ok: true });
	} catch (err) {
		console.error('Error deleting project', err);
		return res.status(500).json({ error: 'Failed to delete project' });
	}
});
