import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

// Environment variables for OAuth2 and Gmail credentials
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;

const sendConfession = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, message } = req.body;

  // Create an OAuth2 client and set credentials
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // Get access token for sending email
  try {
    const accessToken = await oauth2Client.getAccessToken();

    if (!accessToken.token) {
      throw new Error('Failed to retrieve access token');
    }

    // Create a nodemailer transporter using OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
      logger: true,  // Enable logging for debugging
      debug: true,   // Enable detailed debug information
    });

    // Define email options
    const mailOptions = {
      from: EMAIL_USER,
      to: 'recipient@example.com', // Replace with the actual recipient
      subject: 'New Confession',
      text: `Name: ${name}\nMessage: ${message}`,
    };

    // Send email and respond with success or error
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Confession sent!' });

  } catch (error) {
    console.error('Error sending email:', error);  // Log the error details
    return res.status(500).json({ message: 'Failed to send confession', error: (error as Error).message });
  }
};

export default sendConfession;
