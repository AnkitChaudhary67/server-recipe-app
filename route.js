const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const auth = require('./midleware/auth');
const Recipe = require('./model/Recipe');
const bcrypt = require('bcrypt');

const User=require('./model/User');
const SECRET_KEY = 'secret_key';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/register', async (req, res) => {
    const { email, password, repeatPassword } = req.body;
  
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, repeatPassword: hashedPassword});
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.post('/add-recipe', async (req, res) => {
    const recipe = new Recipe({
      title: req.body.title,
      author:req.body.author,
      image: req.body.image,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
    });
  
    try {
      const newRecipe = await recipe.save();
      res.status(201).json(newRecipe);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  router.get('/api/recipes', async (req, res) => {
    try {
      const search = req.query.search || '';
      const regex = new RegExp(search, 'i');
      const recipes = await Recipe.find({ title: { $regex: regex } }).sort({ createdAt: 'desc' });
      res.json(recipes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.get('recipe/:id', async(req, res) => {
    try {
      console.log(req.params);
      const { id }=req.params;
    const getRecipe=await Recipe.findById(_id,id)
      console.log(getRecipe);
      res.status(201).json(getRecipe)
    } catch (error) {
      res.status(422).json(error)
    }
    res.json(res.recipe);
  });

module.exports=router