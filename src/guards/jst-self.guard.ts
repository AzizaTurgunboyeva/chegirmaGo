import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

import { Observable } from "rxjs";

@Injectable()
export class JwtSelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log("auu");
    
    console.log(req.admin.id);
    
    if(Number(req.admin.id) != Number(req.params.id)){
      throw new ForbiddenException({message:"No access admin"})
    }
    console.log(req.admin.id);
    
    return true;
  }
}
