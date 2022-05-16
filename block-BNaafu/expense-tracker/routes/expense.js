var express = require('express');
var User = require('../models/User');
var Income = require('../models/income');
var Expense = require('../models/expense');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('income_form')
});

router.post('/',(req,res,next)=>{
  console.log(req.body)
  User.findOne({email:req.user.email},(err,user)=>{
    if(req.body.type=='income'){
      req.body.user=user._id;
      Income.create(req.body,(err,income)=>{
        if(err) return next(err);
        User.findByIdAndUpdate(income.user._id,{$push:{income:income._id}},(err,updateUser)=>{
          if(err) return next(err);
        res.redirect('/expenses/dashboard')
        })
      })
    }else{
      req.body.user=user._id;
      req.body.category= req.body.source
      Expense.create(req.body,(err,expense)=>{
        if(err) return next(err);
        User.findByIdAndUpdate(expense.user._id,{$push:{expense:expense._id}},(err,updateUser)=>{
          if(err) return next(err);
          res.redirect('/expenses/dashboard')
        })
      })
    }
  })
})

//
router.get('/expense&income',(req,res,next)=>{
  var list = [];
  User.findById(req.user._id).populate("income").populate('expense').exec((err,user)=>{
    if(err) return next(err);

     list.push(user.income,user.expense);
     res.render('income&expense',{list:list.flat()})
  })
})


router.get('/dashboard',async(req,res,next)=>{
  
  try{
    var totalIncome = 0
    var totalExpense = 0
    Income.find({user:req.user._id},(err,incomes)=>{
for(let income of incomes){
  totalIncome +=income.amount;
}
Expense.find({user:req.user._id},(err,incomes)=>{
  for(let income of incomes){
    totalExpense +=income.amount;
  }
  res.render('dashboard',{totalIncome,totalExpense})
  })
   
})
 
  
}catch (err){
res.redirect('/')
}
})

//

router.get('/:id',(req,res,next)=>{
  var id = req.params.id;
  console.log(id)
  if(id=="income"){
    Income.find({user:req.user._id},(err,income)=>{
      if(err) return next(err);
      res.render('income&expense',{list:income})
    })
  }else if(id=="expense"){
    Expense.find({user:req.user._id},(err,expense)=>{
      if(err) return next(err);
      res.render('income&expense',{list:expense})
    })
  }
})





module.exports = router;