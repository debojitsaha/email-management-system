import { Twilio } from "twilio";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

const accountSid: string = String(process.env.TWILIO_ACCOUNT_SID);
const authToken: string = String(process.env.TWILIO_AUTH_TOKEN);
const twilioNumber: string = String(process.env.TWILIO_PHONE_NUMBER);

const client: Twilio = new Twilio(accountSid, authToken);

const SendOTP = async (
    otp: string,
    phone: string
): Promise<MessageInstance> => {
    return client.messages.create({
        body: `Your OTP for Emailo is ${otp}`,
        from: twilioNumber,
        to: phone,
    });
};

export { SendOTP };
