import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import e from 'express';
// Load environment variables
dotenv.config();
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create transporter
    const transporter: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: options.to,
      subject: options.subject,
      text: options.text,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

interface OtpEmailOptions {
  to: string;
  username: string;
  otpCode: string;
  expiryTime: string;
}

export const sendOtpEmail = async (options: OtpEmailOptions): Promise<void> => {
  try {
    // Create transporter
    const transporter: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
    });

    // Set up Handlebars with Nodemailer
    const handlebarOptions : any = {
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve('./templates/'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./app/templates/'),
      extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    // Define the email options
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: options.to,
      subject: 'Your OTP Code',
      template: 'otpTemplate', // This should match the template file name (without extension)
      context: {
        header: 'Your OTP Code',
        username: options.username,
        otpCode: options.otpCode,
        expiryTime: options.expiryTime,
      },
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (error : any) {
    console.error('Error sending OTP email:', error);
    throw new Error(error.message);
  }
};

