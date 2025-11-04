import 'dotenv/config';

import express from 'express';
const app = express();
const DRONE_CONFIG_URL = process.env.DRONE_CONFIG_URL;
const DRONE_LOG_URL = process.env.DRONE_LOG_URL;
const LOG_API_TOKEN = process.env.LOG_API_TOKEN;

app.get('/', (req, res) =>{
    res.send(`สามารถใช้ <br>
    /configs/droneId <br>
    /status/droneId <br>
    /logs/droneId หรือ <br>
    /logs/droneId?page=2 เพื่อไปหน้าต่อไปได้`);
})

// async function getData() {
// const url = "https://example.org/products.json";
// try {
// const response = await fetch(url);
// if (!response.ok) {
// throw new Error (`Response status: ${response.status}`);
// }
// const result = await response.json();
// console.log(result);
//  } catch (error) {
// console.error(error.message);}}

async function getDroneConfigs() {
    const respone = await fetch(DRONE_CONFIG_URL)
    const body = await respone.json();
    const data = body.data;
    return data;
}

async function getDroneLog(droneId, page = 1) {
    const url = `${DRONE_LOG_URL}?filter=drone_id="${droneId}"&sort=-created&perPage=12&page=${page}`;
    const respone2 = await fetch(url,{
        headers: {
            'Authorization': `Bearer ${LOG_API_TOKEN}`
        }
    });
    const body2 = await respone2.json();
    return body2;
}

app.get('/status/:droneId', async (req, res) =>{
    const droneId = Number(req.params.droneId);
    const droneConfigs = await getDroneConfigs();
    const config = droneConfigs.find(drone=> drone.drone_id == droneId);
    const {condition} = config;
    res.json({condition});

})

app.get('/configs/:droneId', async (req, res) =>{
    const droneId = Number(req.params.droneId);
    const droneConfigs = await getDroneConfigs();
    const config = droneConfigs.find(drone=> drone.drone_id == droneId);
    const {drone_id , drone_name , light , country , weight} = config;
    // console.log(droneConfigs);
    // delete config.condition;
    // delete config.population;
    res.json({drone_id: droneId , drone_name , light , country , weight});
    // res.send('oh-good pass');
})

app.get('/logs/:droneId', async (req, res) =>{
    const droneId = Number(req.params.droneId);
    const page = Number(req.query.page) || 1;
    const data2 = await getDroneLog(droneId, page);
    const droneLog = data2.items;
    if (!droneLog || droneLog.length === 0) {
        return res.status(404).json({ error: `No logs found for drone ${droneId}` });
    }
    const logs = droneLog.map(log => ({
        drone_id: log.drone_id,
        drone_name: log.drone_name,
        created: log.created,
        country: log.country,
        celsius: log.celsius
    }));

    res.json({
        page: page,
        totalPages: data2.totalPages,
        totalItems: data2.totalItems,
        logs
    });

})

app.post('/logs', express.json(), async (req, res) => {
    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const response = await fetch(DRONE_LOG_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${LOG_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ drone_id, drone_name, country, celsius })
        });

        const data = await response.json();

        if (response.ok) {
            res.status(201).json({
                message: "Log created successfully",
                log: data
            });
        } else {
            res.status(response.status).json({
                error: "Failed to create log",
                details: data
            });
        }

    } catch (error) {
        console.error("Error posting log:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server is runing on http://localhost:${port}`);
});
