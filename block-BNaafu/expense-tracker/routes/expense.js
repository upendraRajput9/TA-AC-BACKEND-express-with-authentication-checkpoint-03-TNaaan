var express = require('express')
var User = require('../models/User')
var Income = require('../models/income')
var Expense = require('../models/expense')
var { format } = require('date-fns')
var router = express.Router()


//filter income and expense
router.get('/source', async (req, res, next) => {
  if(req.query.month&&req.query.year){
    req.query.start= new Date(req.query.year, req.query.month-1, 1);
    req.query.end = new Date(req.query.year, req.query.month-1 + 1, 0);
  }
  console.log( req.query.start,req.query.end)
  try {
    let incomeExplanse = []
    Income.find(
      { user: req.user._id, source: req.query.source },
      (err, incomes) => {
        for (let income of incomes) {
          incomeExplanse.push(income)
        }
        Expense.find(
          { user: req.user._id, category: req.query.category },
          (err, expenses) => {
            for (let expense of expenses) {
              incomeExplanse.push(expense)
            }
            incomeExplanse.sort((a, b) => b.createdAt - a.createdAt)
            console.log(incomeExplanse)
            res.render('history', { list: incomeExplanse })
          },
        )
      },
    )

    Income.find(
      {
        user: req.user._id,
        $and: [
          { date: { $gte: req.query.start } },
          { date: { $lte: req.query.end } },
        ],
      },
      (err, incomes) => {
        for (let income of incomes) {
          incomeExplanse.push(income)
        }
        Expense.find(
          {
            user: req.user._id,
            $and: [
              { date: { $gte: req.query.start } },
              { date: { $lte: req.query.end } },
            ],
          },
          (err, expenses) => {
            for (let expense of expenses) {
              incomeExplanse.push(expense)
            }
            incomeExplanse.sort((a, b) => b.createdAt - a.createdAt)
            console.log(incomeExplanse)
            res.render('history', { list: incomeExplanse })
          },
        )
      },
    )
  } catch (err) {
    res.redirect('/expenses/dashboard')
  }
})

/* GET home page. */
router.get('/', function (req, res) {
  if (req.user == null) {
    return res.redirect('/')
  }
  res.render('income_form')
})
 
//create income and expense
router.post('/', (req, res, next) => {
  console.log(req.body)
  User.findOne({ email: req.user.email }, (err, user) => {
    if (req.body.type == 'income') {
      req.body.user = user._id
      Income.create(req.body, (err, income) => {
        if (err) return next(err)
        res.redirect('/expenses/dashboard')
      })
    } else {
      req.body.user = user._id
      req.body.category = req.body.source
      Expense.create(req.body, (err, expense) => {
        if (err) return next(err)
        res.redirect('/expenses/dashboard')
      })
    }
  })
})

// Activity
router.get('/history', async (req, res, next) => {
  try {
    let incomeExplanse = []
    Income.find({ user: req.user._id }, (err, incomes) => {
      for (let income of incomes) {
        incomeExplanse.push(income)
      }
      Expense.find({ user: req.user._id }, (err, expenses) => {
        for (let expense of expenses) {
          incomeExplanse.push(expense)
        }
        incomeExplanse.sort((a, b) => b.createdAt - a.createdAt)
        console.log(incomeExplanse)
        res.render('history', { list: incomeExplanse })
      })
    })
  } catch (err) {
    res.redirect('/')
  }
})

//dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    var totalIncome = 0
    var totalExpense = 0
    var date = new Date()
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    Income.find({ user: req.user._id }, (err, incomes) => {
      for (let income of incomes) {
        totalIncome += income.amount
      }
      Expense.find({ user: req.user._id }, (err, expenses) => {
        for (let expense of expenses) {
          totalExpense += expense.amount
        }
        res.render('dashboard', { totalIncome, totalExpense })
      })
    })
  } catch (err) {
    res.redirect('/')
  }
})

//current month income and expenses
router.get('/dashboard/currentDate', async (req, res, next) => {
  try {
    var totalIncome = 0
    var totalExpense = 0
    var date = new Date()
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    Income.find(
      {
        user: req.user._id,
        $and: [{ date: { $gte: firstDay } }, { date: { $lte: lastDay } }],
      },
      (err, incomes) => {
        for (let income of incomes) {
          totalIncome += income.amount
        }
        Expense.find(
          {
            user: req.user._id,
            $and: [{ date: { $gte: firstDay } }, { date: { $lte: lastDay } }],
          },
          (err, expenses) => {
            for (let expense of expenses) {
              totalExpense += expense.amount
            }
            res.render('dashboard', { totalIncome, totalExpense })
          },
        )
      },
    )
  } catch (err) {
    res.redirect('/')
  }
})

//find All income and expense

router.get('/:id', (req, res, next) => {
  var id = req.params.id
  console.log(id)
  if (id == 'income') {
    Income.find({ user: req.user._id }, (err, income) => {
      if (err) return next(err)
      res.render('income&expense', { list: income })
    })
  } else if (id == 'expense') {
    Expense.find({ user: req.user._id }, (err, expense) => {
      if (err) return next(err)
      res.render('income&expense', { list: expense })
    })
  }
})

//Edit
router.get('/edit/:id/:type', (req, res, next) => {
  var id = req.params.id
  var type = req.params.type
  if (type == 'income') {
    Income.findById(id, (err, income) => {
      if (err) return res.redirect('/expenses/type')
      res.render('editExpenseIncome', {
        data: income,
        date: format(income.date, 'yyyy-MM-dd'),
      })
    })
  } else {
    Expense.findById(id, (err, expense) => {
      if (err) return res.redirect('/expenses/type')
      res.render('editExpenseIncome', {
        data: expense,
        date: format(expense.date, 'yyyy-MM-dd'),
      })
    })
  }
})

//delete
router.get('/delete/:id/:type', (req, res, next) => {
  var id = req.params.id
  var type = req.params.type
  if (type == 'income') {
    Income.findByIdAndDelete(id, (err, income) => {
      if (err) return res.redirect('/expenses/' + type)
      res.redirect('/expenses/' + type)
    })
  } else {
    Expense.findByIdAndDelete(id, (err, expense) => {
      
      if (err) return res.redirect('/expenses/' + type)
      res.redirect('/expenses/' + type)
    })
  }
})

module.exports = router
