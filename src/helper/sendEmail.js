import { Resend } from "resend";
const resend=new Resend(process.env.EMAIL_API);
export const sendEmail=async(receiver,subject,content)=>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: receiver,
            subject: subject,
            html: content
            });
    } catch (error) {
        console.log(error.message)
    }
}