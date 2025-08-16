import { NextResponse } from "next/server";
import { sendEmail } from "@/helper/sendEmail";
export async function POST(request){
    try {
        const {to,subject,content}=await request.json()
        const response=await sendEmail(to,subject,content)
        return NextResponse.json({success:true},{status:200})
    } catch (error) {
        console.log(error.message)
    }
}