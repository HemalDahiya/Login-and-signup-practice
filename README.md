Above is the code for a full stack nodejs application, that uses ejs to create a user management application, with sign up, signin, forgot password etc.
It is server side rendered in ejs and in frontend vanilla js and html and css are used, no specific framework was used.

# My Node.js App 🚀

This is a Node.js project using MySQL.

## 📌 Setup Instructions

### 1️⃣ Clone the repository:

git clone https://github.com/your-username/your-repo.git
cd your-repo

run npm i to install all the dependencies

Now we must setup the database schema tables etc, since this is a database first application.
Run the setup.sql file code in mysql workbench.


Create an .env file in root folder.

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=Your database passowrd in single quotes
SECRET_KEY=secreat key for encryption
DB_Database= Practice1
NODEMAILER_api=Nodemailer api key

run npm start.
