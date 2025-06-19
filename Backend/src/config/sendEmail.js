import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API_KEY){
    console.log("Provide RESEND_API_KEY in side the .env file")
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async({sendTo, subject, html })=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Blinket <onboarding@resend.dev>',
            to: "officialthakur94@gmail.com",
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail
