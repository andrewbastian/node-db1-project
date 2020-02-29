const router = require('express').Router();

const accountsDb = require('../data/dbConfig.js');


//get all accounts

router.get("/", async (req, res, next) => {
  try {
    // translates to `SELECT * FROM accounts;`
    const account = await accountsDb.select("*").from("accounts")

    res.json(account)
  } catch(err) {
    next(err)
  }
})


// get account by id

router.get("/:id", async (req, res, next) => {
  try {
    // translates to `SELECT * FROM accounts WHERE id = ? LIMIT 1;`
    // const post = await db.first("*").from("accounts").where("id", req.params.id)
    const account = await accountsDb.first("*").from("accounts").where({ id: req.params.id })

    res.json(account)
  } catch(err) {
    next(err)
  }
})


//creat account


router.post("/", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget,
    }

    // translates to `INSERT INTO accounts (name, budget) VALUES (?, ?);`
    // .insert returns an array of IDs, since we could potentially insert multiple rows at once.
    // we only want the id of the first item inserted, since we're only inserting one item.
    const [id] = await accountsDb("accounts").insert(payload)
    // get the newly created resource from the database in another request so we can return it.
    const newAccount = await accountsDb("accounts").where("id", id).first()

    res.status(201).json(newAccount)
  } catch(err) {
    next(err)
  }
})

// update account

router.put("/:id", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget,
    }

    // translates to `UPDATE accounts SET ? = ? WHERE id = ?`
    await accountsDb("accounts").where("id", req.params.id).update(payload)
    const account = await accountsDb("accounts").where("id", req.params.id).first()

    res.json(account)
  } catch(err) {
    next(err)
  }
})


// delete account 

router.delete("/:id", async (req, res, next) => {
  try {
    // translates to `DELETE FROM accounts WHERE id = ?`
    // DON'T FORGET THE .WHERE OR YOU MIGHT DELETE YOUR ENTIRE TABLE
    await accountsDb("accounts").where("id", req.params.id).del()

    res.status(204).end()
  } catch(err) {
    next(err)
  }
})




module.exports = router;
