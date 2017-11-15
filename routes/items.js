const express = require('express');
const router = express.Router();

//Bring in Item Model
let Item = require('../models/item');

// Bring in User Model
let User = require('../models/user');

router.get('/add', ensureAuthenticated, function(req, res) {
    Item.find({}, function(err, items){
        if(err){
            console.log(err)
        }else {
            res.render('add_item', {
                title: 'food',
                items: items
            });
        }
    });
});


//Add Submit POST Route
router.post('/add', function(req,res){
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('category', 'Category is required').notEmpty();


    //get errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_item', {
            title: 'Food',
            errors:errors
        })
    } else {
        let item = new Item();
        item.name = req.body.name;
        item.category = req.body.category;
        item.quantity = req.body.quantity;
        item.author = req.user._id;
    
        item.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success', 'item added');
                res.redirect('/');
            }
        });
    }
});

router.get('/edit/:_id', ensureAuthenticated, function(req,res){
    Item.findById(req.params._id, function(err, item){
        if(item.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_item', {  
            item:item
        });
    });
});

router.post('/edit/:id', function(req,res){
    let item = {};
    item.name = req.body.name;
    item.category = req.body.category;
    item.quantity = req.body.quantity;

    let query = {_id:req.params.id}

    Item.update(query, item, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success' , 'Item updated');
            res.redirect('/');
        }
    })
});

//Delete Item
router.delete('/:id', function(req,res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id};

    Item.findById(req.params.id, function(err, item){
        if(item.author != req.user._id){
            res.status(500).send();
        } else {
            Item.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    }); 
});

//Get Single Item
router.get('/:_id', function(req,res){
    Item.findById(req.params._id, function(err, item){
        User.findById(item.author, function(err, user){
            res.render('item', {  
                item:item,
                author: user.name
            });
        })
        
    });
});

//access control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
};

module.exports = router;