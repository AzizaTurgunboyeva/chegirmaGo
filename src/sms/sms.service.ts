import { Injectable } from "@nestjs/common";
const FormData = require("form-data");
import axios from "axios";
@Injectable()
export class SmsService {
    private token:string|null=null

  async sendSms(phone_number: string, otp: string) {

    const data = new FormData();
    data.append("mobile_phone", phone_number);
    data.append("message", " Bu Eskiz dan test ");
    data.append("mobile_phone", phone_number);
    data.append("from", "4546");
    console.log(process.env.SMS_SERVICE_URL);

    const config = {
      method: "post",
      maxBodyLenght: Infinity,
      url: process.env.SMS_SERVICE_URL,
      headers: {
        Authorization: `Bearer ${process.env.SMS_TOKEN}`,
      },
      data: data,
    };
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
  async refreshToken(user_id:number,) {
        
  }
  async getTokenEskiz() {
        if(!this.token){
            console.log("Token topilmadi");
            return null
            
        }
        const config = {
          method: "post",
          maxBodyLenght: Infinity,
          url: process.env.SMS_SERVICE_URL,
          headers: {
            Authorization: ` Bearer ${this.token}`
        }
    }
        
        try {
          const response = await axios(config);
          this.token =response.data.data.token
          console.log("token olindi",this.token);
          
          return this.token
        } catch (error) {
          console.log(error);
          return { status: 500 };
        }
  }
}
