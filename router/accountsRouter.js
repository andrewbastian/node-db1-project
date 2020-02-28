const router = require('express').Router();

const accountsDb = require('../data/dbConfig.js');


//get all accounts
//
router.get('/', (req, res, next) =>{
	accountsDb('accounts')
		.then(accounts => {
			res.status(200).json(accounts)
		})
		.catch((err) => {
			console.log(err)
			next(err)
		})
})

// get account by id


// router.get('/:id', validateAccountId, async (req, res, next) => {
//   try {
//   	res.json(await accountsDb.getById(req.params.id))
//   } catch (err) {
//   	next(err)
//   }
// });
// 
router.get('/:id', (req, res) =>{
	accountsDb('accounts')
		.where({id: req.params.id})
		.first()
		.then(account => {
			if (account) {
				res.status(200).json(account)
			} else {
				res.status(400).json({message: "no account found for that ID"})
			}
		})
})

//creat account
//
// im getting an an err when i send post, but when i run get all my post has gone through.

router.post('/', (req, res, next) => {
  if (validateAccount(req.body)) {
    accountsDb('accounts')
      .insert(req.body, 'id')
      .then(([id]) => id)
      .then(id => {
        db('accounts')
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json(account);
          });
      })
      .catch((err) => {
      	console.log(err)
      	next(err)
      });
  } else {
    res.status(400).json({
      message: 'name and budget needed',
    });
  }
});

// update account

router.put('/:id', (req, res, next) =>{
	accountsDb('accounts')
	.where({id: req.params.id})
	.then(account => {
		if (account) {
			res.status(200).json({message: `${account} updated`})
		} else {
			res.status(400).json({message: 'no account found'})
		}
	})
	.catch((err) => {
		console.log(err)
		next(err)
	})
})
//middleware

function validateAccount({name, budget}) {
  return name && typeof budget === 'number' && budget >= 0;
}

async function validateAccountId(req, res, next) {
   try {
   	const account = await accountsDb.getById(req.params.id)

   	if (account) {
   		req.account = account
   		next()
   	} else {
   		res.status(404).json({ message: "account not found"})
   	}
   } catch(err) {
   	console.log(err)
   	next(err)
   }
}

//helper

function getById(id) {
  return accountsDb('accounts')
    .where({ id })
    .first();
}

module.exports = router;
