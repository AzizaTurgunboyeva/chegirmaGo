import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const CookiGetter= createParamDecorator(
    //  @CookiGetter("refresh_token"=>data) refreshToken:string,
    async (data:string, context:ExecutionContext):Promise<string> =>{
        const request =context.switchToHttp().getRequest()
        const refreshToken= request.cookies[data]//cookieParser oberyapti
        if(!refreshToken){
            throw new UnauthorizedException("Token is not found")
        }
        return refreshToken
    }
)