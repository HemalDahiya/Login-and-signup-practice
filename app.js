const path = require('path');
const mysql= require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./util/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const nodemailer= require('nodemailer');
const sendgridTransport= require('nodemailer-sendgrid-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.NODEMAILER_api
    }
}));
const { name } = require('ejs');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//const connection = mysql.createConnection(db); // or mysql.createPool(options);
const sessionStore = new MySQLStore({}/* session store options */, db);



app.use(session({secret:'my secreat', resave:false, saveUninitialized:false, store: sessionStore}));


//cheak if already logged in if so go and redirect to redirect

//if(not logged in)

app.post('/signin', (req, res) => {
    let Password = req.body["Password"];
    let Email = req.body["Email"];
    
    

    console.log(Password);
    console.log(Email);

    db.execute('SELECT * FROM user_credentials WHERE email = ?', [Email])
        .then(([rows, fields]) => {
            console.log(rows);
            if (rows.length === 1) {
                // User found
                if (rows[0].password === String(Password)) {
                    //cookie logged in set for the user
                    req.session.IsloggedIn = true;
                    
                    let a = Number(rows[0].id);
                    req.session.CurrentUser_id=a;
                    console.log(req.session);

                    // console.log("Checked");
                    // console.log(rows[0].id);
                    
                    db.execute('SELECT * FROM user_info WHERE user_id = ?', [a]) // Ensure parameter is an array
                        .then(([rows1, fields]) => {
                            res.render("../views/Redirected.ejs", {
                                name: rows1[0].name,
                                email: rows[0].email,
                                salary: rows1[0].salary
                            });
                        })
                        .catch(err => {
                            console.error('Error executing query:', err);
                            res.status(500).json({ error: err.message });
                        });
                } else {
                    res.status(404).json({ message: "Wrong password" });
                }
            } else {
                // User not found
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            console.error('Error executing query:', err);
            res.status(500).json({ error: err.message });
        });
});

//used to get everyones info

app.get('/info', (req, res) => {
    if(req.session.IsloggedIn===true)
    {

    
    
    db.execute('SELECT user_credentials.*, user_info.* FROM  user_credentials INNER JOIN user_info ON user_credentials.id = user_info.user_id;')
        .then(([results, fields]) => {
            console.log(results);
            res.render('../views/allusers.ejs', { results });
            
            // res.json(results);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
    }
    else{
        res.render("../views/Signup.ejs", {});
    }
});

app.get("/", ( req, res)=>{
    res.render("../views/Login.ejs",{});
});

app.post("/submit-user", (req, res)=>
{
    const { email, name, password, address, salary } = req.body;

    // Trim whitespace from inputs and handle potential undefined values
    const trimmedEmail = email ? email.trim() : null;
    const trimmedName = name ? name.trim() : null;
    const trimmedPassword = password ? password.trim() : null;
    const trimmedAddress = address ? address.trim() : null;
    const trimmedSalary = salary; 

    console.log(trimmedEmail);
    console.log(trimmedName);
    console.log(trimmedAddress);
    console.log(trimmedPassword);
    console.log(trimmedSalary);
    
    db.execute('SELECT * FROM user_credentials WHERE email= ?', [trimmedEmail]).then(([rows, fields])=>
    {
        if(rows.length === 1)
        {
            res.sendStatus(400);
        }
    }).catch(err => {
        console.error('Error executing inital cheack before add query:', err);
        res.status(500).json({ error: err.message });
    });
    
    
    db.execute('INSERT INTO user_credentials (email, password) VALUES (?, ?)', [trimmedEmail, trimmedPassword])
    .then(([result]) => {
        //console.log('Insertion successful:', result);
        if(result.insertId!=null)
        {
            db.execute('INSERT INTO user_info (user_id, name, address, salary) VALUES (?, ?, ?, ?)', [result.insertId, trimmedName, trimmedAddress, trimmedSalary]).
            then(([result1])=>{
                console.log(result1);
                res.status(200).json({message: "success" });
            }

            ).catch(err=>{
                console.error('Insertion error:', err);
                res.status(500).json({ error: err.message });
        });

        }
        else{
            res.status(500).json({ error: err.message });
        }
        // Handle success here
    })
    .catch(err => {
        console.error('Insertion error:', err);
        res.status(500).json({ error: err.message });
        // Handle error here
    });
});

app.get("/Signup", (req, res)=>{
    res.render("../views/Signup.ejs", {});
});
//if logged in send the redirected page
//if logout came in delete the logged in current user.

// app.get("/Redirected", (req, res)=>{
    
//     //res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://www.google.com/");
//     res.render("../views/Redirected.ejs", {name:"Hemal", email:"abc@gmail.com", salary:60000});
// });


app.get('/logout', (req, res) => {
    // Destroy the session
    if(req.session.IsloggedIn===true)
    {
        req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying session:', err);
                return res.redirect('/'); // Handle error if necessary
            }
    
            // Clear the session cookie from the browser
            res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name
    
            // Redirect to the login page or another page
            res.redirect('/');
        });
    }
    else
    {
        res.status(404).render("../views/Notfound(404).ejs");
    }
    
});

app.get('/ForgotPassword', (req, res) => {
    if(req.session.IsloggedIn===true)
     {
            req.session.destroy((err) => {
                if (err) {
                    console.log('Error destroying session:', err);
                    return res.redirect('/'); // Handle error if necessary
                }
        
                // Clear the session cookie from the browser
                res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name
        
                // Redirect to the login page or another page
                res.redirect('/');
            });
     }

     res.render("../views/SendEmailForOTP.ejs", {});

});

app.post('/SendEmail', async (req, res) => {
    try {
        console.log("Sending email");

        // Get and trim the email from the request body
        let email = req.body.email;
        const trimmedEmail = email ? email.trim() : null;
        console.log(trimmedEmail);

        if (!trimmedEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if the email exists in the database
        const [rows] = await db.execute('SELECT * FROM user_credentials WHERE email = ?', [trimmedEmail]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        //Create a otp to send using random or bcyrpt
        function generateOTP(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let otp = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                otp += characters[randomIndex];
            }
            return otp;
        }
        
        const otp = generateOTP(7);
        req.session.otpForReset=otp;
        //add it to the session to store caleed PasswordResetOTP


        const mailOptions = {
            from: 'hemaldahiya@outlook.com', // Sender address
            to: `${trimmedEmail}`, // Recipient address
            subject: 'Password Reset', // Subject line
            text: `Hi, please reset your password.
                    The OTP is: ${otp}` // Plain text body
        };

        await transporter.sendMail(mailOptions);
        req.session.email=trimmedEmail;
        res.json({ message: 'Password reset email sent successfully' });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/send-otp', async(req, res)=>{
    let otp=req.body.otp;
    otp=otp.trim();
    if(!(req.session.otpForReset===otp))
    {
        return res.status(404).json({ message: 'Entered wrong OTP' });
    }
    console.log(otp);
    console.log(req.session.otpForReset);
    req.session.ValidOtp=true;
    
    //redirect to changepassword page
    res.render("../views/ResetPassword.ejs", {});
});

app.post('/update-forgotten-password', async (req, res) => {
    let newpassword = req.body.password;
    let email = req.session.email;

    console.log(newpassword);
    console.log(email);

    if (req.session.ValidOtp === true) {
        try {
            const [rows] = await db.execute('SELECT * FROM user_credentials WHERE email = ?', [email]);

            if (rows.length > 0) {
                // If the user exists, update their password
                const newPasswordTrimmed = newpassword.trim();

                await db.execute('UPDATE user_credentials SET password = ? WHERE email = ?', [newPasswordTrimmed, email]);

                console.log('Password updated successfully.');

                req.session.destroy((err) => {
                    if (err) {
                        console.log('Error destroying session:', err);
                        return res.status(500).json({ message: 'Error destroying session' });
                    }

                    // Clear the session cookie from the browser
                    res.clearCookie('connect.sid'); // 'connect.sid' is the default cookie name

                    // Redirect to the login page or another page
                    res.redirect('/'); // Adjust the path to your login page
                });
            } else {
                console.log('No user found with the given email.');
                return res.status(404).json({ message: 'Problem occurred, try again later' });
            }
        } catch (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    } else {
        // Invalid OTP, redirect to a 404 or error page
        res.status(403).render('../views/Notfound(404).ejs'); // Adjust the path to your 404 page
    }
});

const port = process.env.PORT || 3000;
app.listen(port);
