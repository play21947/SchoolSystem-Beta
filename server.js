const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql2')

app.use(cors())
app.use(express.json())

const dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school'
})


app.post('/login', (req, res)=>{
    let username = req.body.username
    let password = req.body.password

    dbcon.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, rs)=>{
        if(err) throw err

        if(rs.length > 0){
            res.json({Login: true, rs: rs})
        }
        else{
            res.json({Login: false})
        }
    })
})

app.get('/get_subject', (req, res)=>{
    dbcon.query("SELECT * FROM subject", (err, rs)=>{
        if(err) throw err

        res.json(rs)
    })
})

app.post('/get_users', (req, res)=>{
    let username = req.body.username
    dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs)=>{
        if(err) throw err

        res.json(rs)
    })
})

app.post("/enroll", (req, res)=>{
    let username = req.body.username
    let id_subject = req.body.subject
    dbcon.query("SELECT * FROM subject WHERE id = ?", [id_subject], (err, rs)=>{
        if(err) throw err

        if(rs.length > 0){
            dbcon.query("UPDATE users SET activity = ? WHERE username = ?", [rs[0].subject_name, username], (err, rs2)=>{
                if(err) throw err
    
                if(rs[0].subject_current < rs[0].subject_max){
                    let count = rs[0].subject_current
                    ncount = count + 1
                    dbcon.query("UPDATE subject SET subject_current = ? WHERE id = ?", [ncount, id_subject], (err, rs3)=>{
                        if(err) throw err

                        res.json({Success: true})
                    })
                }
                else{
                    res.json({Success: false})
                }
            })
        }
    })
})


app.post("/ownclass", (req, res)=>{
    let subject = req.body.subject
    dbcon.query("SELECT * FROM USERS WHERE activity = ?", [subject], (err ,rs)=>{
        if(err) throw err

        res.json(rs)
    })
})


app.post("/register", (req, res)=>{

    let username = req.body.username
    let password = req.body.password
    let cfpassword = req.body.cfpassword

    dbcon.query("SELECT * FROM users WHERE username = ? AND password = password", [username, password], (err, rs)=>{
        if(err) throw err

        if(rs.length > 0){
            res.json({Register: false})
        }
        else{
            dbcon.query("INSERT INTO users (username, password, role, create_max, create_current, activity) VALUES (?, ?, ?, ?, ?, ?)", [username, password, 0, 0, '', ''], (err, rs)=>{
                if(err) throw err

                res.json({Register: true})
            })
        }
    })
})


app.post("/addsubject", (req, res)=>{
    let name = req.body.name
    let amount = req.body.amount
    let id = req.body.id
    let img = req.body.img

    console.log(name, amount, id)

    if(name || amount || id){
        dbcon.query("SELECT * FROM subject WHERE subject_name = ?", [name], (err, rs)=>{
            if(err) throw err

            if(rs.length > 0){
                res.json({AlreadySubject: true})
            }
            else{
                dbcon.query("INSERT INTO subject (subject_name, subject_img, subject_max, subject_current, detail) VALUES (? ,?, ?, ?, ?)", [name, img, amount, 0, ''], (err, rs2)=>{
                    if(err) throw err

                    dbcon.query("UPDATE users SET create_current = ? WHERE id = ?", [name, id], (err, rs3)=>{
                        if(err) throw err

                        res.json(rs3)
                    })
                })
            }
        })
    }
})

app.post("/leave", (req, res)=>{
    let username = req.body.username

    if(username){
        dbcon.query("SELECT * FROM users WHERE username = ?", [username], (err, rs)=>{
            if(err) throw err

            if(rs.length > 0){
                dbcon.query("SELECT * FROM subject WHERE subject_name = ?", [rs[0].activity], (err, rs2)=>{
                    if(err) throw err

                    let count = rs2[0].subject_current
                    let ncount = count - 1
                    dbcon.query("UPDATE subject SET subject_current = ? WHERE subject_name = ?", [ncount, rs[0].activity], (err, rs3)=>{
                        if(err) throw err

                        dbcon.query("UPDATE users SET activity = ? WHERE username = ?", ['', username], (err, rs5)=>{
                            if(err) throw err

                            res.json(rs5)
                        })
                    })
                })
            }
        })
    }
})


app.listen('3001', ()=>{
    console.log("Server has started")
})