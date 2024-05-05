const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbConnectionMiddleware = require('./models/dbConnection')
const Register = require('./routes/register.js')
const OtpVerify = require('./routes/otpverify.js')
const Login = require('./routes/login.js')
const LoginUpdate = require('./routes/loginupdate.js')
const LoginHistory = require('./routes/loginhistory.js')
const { Server: WebSocketServer } = require('ws');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

dbConnectionMiddleware();

app.get('/', (req, res) => {
    res.json({ message: "Response from nodejs server!" })
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name)
        const register = await Register(name, email, password)
        res.send(register)
    } catch (error) {
        res.json({ condition: false, message: "catch error in server: " + error })
    }
});

app.post('/verifyotp', async (req, res) => {
    try {
        const { userid, otp } = req.body;
        console.log(userid + "----" + otp)
        const otpverify = await OtpVerify(userid, otp);
        res.send(otpverify)
    } catch (error) {
        res.json({ condition: false, message: "catch error in server: " + error })
    }
});

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'login') {
            const { email, password } = data;
            console.log(email + "--" + password)
            const loginverify = await Login(email, password)
            console.log(loginverify)
            ws.send(JSON.stringify(loginverify));
        }else if(data.type == 'login_status'){
            const loginupdate = await LoginUpdate(data.uid, data.loginstatus)
        }else if(data.type === 'get_login_history') {
            const loginhistory = await LoginHistory(data.uid)
            console.log(loginhistory)
            ws.send(JSON.stringify(loginhistory));
        }else if (data.type === 'disconnect') {
            console.log('Client requested disconnection');
            ws.terminate(); // Close the connection
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const server = app.listen(5000, () => {
    console.log("Server Running in Port 5000")
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
