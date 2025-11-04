# 🚀 Drone API Server

โปรเจ็กต์นี้เป็น **API Server** ที่พัฒนาโดยใช้ **Node.js** และ **Express.js**  
เพื่อจัดการข้อมูลของโดรน (Drone) โดยมีการเชื่อมต่อกับ 2 เซิร์ฟเวอร์ภายนอก ได้แก่  

- 🛰️ **Drone Config Server** – สำหรับดึงข้อมูลการตั้งค่าโดรน  
- 🧾 **Drone Log Server (PocketBase)** – สำหรับเก็บและเรียกดูข้อมูล log ของโดรน  

ระบบนี้เป็นส่วนหนึ่งของ Assignment ที่ใช้สำหรับฝึกสร้าง RESTful API  
พร้อมรองรับการเรียกใช้งานผ่าน Frontend ที่จะทำใน Assignment #2  

---

## 📚 Table of Contents
1. [Features](#-features)
2. [Technology Stack](#-technology-stack)
3. [Installation & Setup](#️-installation--setup)
4. [Environment Variables](#-environment-variables)
5. [API Documentation](#-api-documentation)
6. [Pagination](#-pagination)
7. [Deployment](#-deployment)
8. [License](#-license)

---

## ✨ Features

| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/configs/:droneId` | **GET** | ดึงข้อมูลการตั้งค่าของโดรนจาก Drone Config Server |
| `/status/:droneId` | **GET** | ดึงสถานะ (condition) ของโดรน |
| `/logs/:droneId` | **GET** | ดึงข้อมูล log ล่าสุดของโดรนจาก Drone Log Server (รองรับ pagination) |
| `/logs` | **POST** | เพิ่ม log ใหม่ของโดรนเข้าไปใน Drone Log Server |

---

## 🧰 Technology Stack

- **Node.js** — รันเซิร์ฟเวอร์ฝั่ง backend  
- **Express.js** — Framework สำหรับสร้าง RESTful API  
- **dotenv** — สำหรับจัดการ Environment Variables  
- **PocketBase API** — ใช้เป็นฐานข้อมูล log  
- **Fetch API** — สำหรับเรียก REST API ภายนอก  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Project จาก GitHub
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
2️⃣ ติดตั้ง Dependencies
bash
คัดลอกโค้ด
npm install
3️⃣ สร้างไฟล์ .env
สร้างไฟล์ชื่อ .env ที่โฟลเดอร์หลัก แล้วใส่ค่าต่อไปนี้

ini
คัดลอกโค้ด
PORT=3000
DRONE_CONFIG_URL=https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec
DRONE_LOG_URL=https://app-tracking.pockethost.io/api/collections/drone_logs/records
LOG_API_TOKEN=20250901efx
⚠️ หมายเหตุ:

อย่าใส่ Token หรือ URL จริงในโค้ดโดยตรง

.env ควรถูกเพิ่มใน .gitignore เพื่อไม่ให้ข้อมูลลับหลุดไปใน GitHub

4️⃣ รันเซิร์ฟเวอร์
bash
คัดลอกโค้ด
node index.js
หรือใช้ Nodemon เพื่อรันอัตโนมัติเมื่อไฟล์มีการเปลี่ยนแปลง:

bash
คัดลอกโค้ด
npx nodemon index.js
หลังจากรันเสร็จจะได้ข้อความ:

arduino
คัดลอกโค้ด
Server is running on http://localhost:3000
🌐 Environment Variables
Variable	Description
PORT	พอร์ตที่ใช้รันเซิร์ฟเวอร์
DRONE_CONFIG_URL	URL ของ Drone Config Server
DRONE_LOG_URL	URL ของ Drone Log Server
LOG_API_TOKEN	Bearer Token สำหรับเข้าถึง Drone Log Server

📡 API Documentation
🔹 GET /configs/:droneId
Description: ดึงข้อมูลการตั้งค่าของโดรน
Response Example:

json
คัดลอกโค้ด
{
  "drone_id": 66010608,
  "drone_name": "Exeoid",
  "light": "on",
  "country": "Japan",
  "weight": 21
}
🔹 GET /status/:droneId
Description: ดึงสถานะของโดรน
Response Example:

json
คัดลอกโค้ด
{
  "condition": "good"
}
🔹 GET /logs/:droneId?page=1
Description: ดึงข้อมูล Log ล่าสุดของโดรน
รองรับ Pagination (12 รายการต่อหน้า)

Query Parameters:

Name	Type	Description
page	Number	เลขหน้าที่ต้องการดู (ค่าเริ่มต้น = 1)

Response Example:

json
คัดลอกโค้ด
[
  {
    "drone_id": 66010608,
    "drone_name": "Exeoid",
    "created": "2025-11-03T17:58:08.557Z",
    "country": "Japan",
    "celsius": 21.3
  },
  {
    "drone_id": 66010608,
    "drone_name": "Exeoid",
    "created": "2025-11-03T17:57:58.136Z",
    "country": "Japan",
    "celsius": 8
  }
]
🔹 POST /logs
Description: เพิ่มข้อมูล log ใหม่เข้า Drone Log Server
Request Body Example:

json
คัดลอกโค้ด
{
  "drone_id": 66010608,
  "drone_name": "Exeoid",
  "country": "Japan",
  "celsius": 22.5
}
Response Example:

json
คัดลอกโค้ด
{
  "message": "Log created successfully",
  "log": {
    "drone_id": 66010608,
    "drone_name": "Exeoid",
    "country": "Japan",
    "celsius": 22.5
  }
}
🔁 Pagination
ระบบรองรับ Pagination ผ่าน query parameter ?page=
โดยจะแสดง 12 รายการต่อหน้า (เรียงจาก log ล่าสุดขึ้นก่อน)

ตัวอย่าง	URL
หน้าแรก	GET /logs/66010608?page=1
หน้าถัดไป	GET /logs/66010608?page=2
