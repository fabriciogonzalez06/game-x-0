import { User } from "src/app/auth/models/user.model";

export interface Game{
  uidGame?:string;
  uidInvitation:string;
  numRounds:number;
  rounds:any[];
  winner:User;
  loser:User;
  challenger:User;
  challenged:User;
  created_at:string | Date;
  stated_at:string | Date;
  ended_at:string | Date;
  canceled:boolean;
  finished:boolean;
}
