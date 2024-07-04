# Student Attendance System

Welcome to the **Student Attendance System**! 📚 This application helps in managing student attendance by scanning QR codes and recording attendance data.

## Getting Started 🚀

Follow these instructions to get the project up and running on your local machine.

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/student-attendance-system.git
    cd student-attendance-system
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory and add your Discord bot token and webhook URL:

    ```plaintext
    DISCORD_BOT_TOKEN=your_discord_bot_token
    DISCORD_WEBHOOK_URL=your_discord_webhook_url
    ```

4. **Run the application**

    Start the server:

    ```bash
    node server.js
    ```

    The application will be available at `http://localhost:3000`.

### Usage

1. **Open the application** in your browser.
2. **Select a subject** by clicking the corresponding button.
3. **Scan a student QR code** using the webcam.
4. The attendance will be recorded and updated in real-time on Discord.

## Discord Bot Commands 🤖

- **`!attendance <student_name>`**: Get the attendance record of a specific student.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
