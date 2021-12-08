const db = require('../models');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = db.user;
const Role = db.role;
const Post = db.post;
const Comment = db.comment;

exports.create = async (req, res, next) => {
    try {
        let role = await Role.findOne({ attributes: ['id'], where: { name: 'participant' }, raw: true });
        if (!role) {
            await Role.create();
            role = await Role.findOne({ attributes: ['id'], where: { name: 'participant' }, raw: true });
        }
        req.body.role_id = role.id;
        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.create({ ...req.body });
        return res.status(201).json({ message: 'Utilisateur créé !' });
    }
    catch (err) {
        res.status(400).json({ err });
        console.error(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email }, raw: true });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        else {
            const password = user.password;
            const hash = await bcrypt.compare(req.body.password, password);
            if (!password || !hash) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            else {
                const token = jwt.sign({id: user.id}, 'secretKey', { expiresIn: '12h' });
                return res.status(200).json({ message: 'Utilisateur connecté !', token });
            }
        }    
    }
    catch (err) {
        res.status(500).json({ err });
        console.error(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const results = await User.findAll({ include: ['role'] });
        return res.status(200).json(results);
    }
    catch (err) {
        res.status(400).json({ err });
        console.error(err);
    }
};

exports.get = async (req, res, next) => {
    try {
        const result = await User.findOne({ include: ['role'], where: { id: req.params.id } });
        return res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ err });
        console.error(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        await User.update({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        },
            { where: { id: req.params.id } });
        return res.status(200).json({ message: 'Utilisateur mis à jour !' })
    }
    catch (err) {
        res.status(400).json({ err });
        console.error(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await Post.destroy({ where: { user_id: req.params.id } });
        await Comment.destroy({ where: { user_id: req.params.id } });
        await User.destroy({ where: { id: req.params.id } });
        return res.status(200).json({ message: 'Utilisateur supprimé !' })
    }
    catch (err) {
        res.status(400).json({ err });
        console.error(err);
    }
};