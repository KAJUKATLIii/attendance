Student Attendance System
Welcome to the Student Attendance System! 📚 This application helps in managing student attendance by scanning QR codes and recording attendance data. It integrates with Discord for real-time notifications and uses a CSV file for storing attendance data.


Features ✨
QR Code Scanning: Scan student QR codes to mark attendance.
Subject Selection: Choose the subject for which attendance is being recorded.
Real-time Updates: Attendance data is sent to Discord for instant updates.
CSV Storage: Attendance data is stored in a CSV file for easy access and management.
Discord Bot Integration: Check attendance records by querying the Discord bot.
Getting Started 🚀
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Node.js
npm or yarn
Installation
Clone the repository

bash
Copy code
git clone https://github.com/yourusername/student-attendance-system.git
cd student-attendance-system
Install dependencies

bash
Copy code
npm install
Set up environment variables

Create a .env file in the root directory and add your Discord bot token and webhook URL:

plaintext
Copy code
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_WEBHOOK_URL=your_discord_webhook_url
Run the application

Start the server:

bash
Copy code
node server.js
The application will be available at http://localhost:3000.

Usage
Open the application in your browser.
Select a subject by clicking the corresponding button.
Scan a student QR code using the webcam.
The attendance will be recorded and updated in real-time on Discord.
Screenshots 📸
Main Interface

Attendance Recorded Notification

Discord Bot Commands 🤖
!attendance <student_name>: Get the attendance record of a specific student.
Troubleshooting
If you encounter any issues, check the following:

Ensure your .env file is correctly set up with valid tokens and URLs.
Make sure the attendance.csv file has the correct permissions and exists in the project directory.
For more detailed troubleshooting, visit our Troubleshooting Guide.

Contributing
We welcome contributions to improve the system. Feel free to fork the repository, create a branch, and submit a pull request!

License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For any queries or support, please contact me.

