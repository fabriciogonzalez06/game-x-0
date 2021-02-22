import { User } from "src/app/auth/models/user.model";

export interface Invitation{
    uidInvitation?:string;
    from:string;
    to:string;
    created_at:string;
    userTo:User,
    userFrom:User;
    accepted:boolean;
    rejected:boolean;
    pending:boolean;
    rounds:number;
}
