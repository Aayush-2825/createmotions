"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileCard({ user }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-500" />
      
      <Avatar className="h-24 w-24 ring-4 ring-white/5 shadow-2xl shrink-0">
        <AvatarImage src={user.image} className="object-cover" />
        <AvatarFallback className="bg-neutral-800 text-white font-bold text-2xl flex items-center justify-center h-full w-full">
          {user.name?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-4 flex-1 w-full text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
           <h2 className="text-3xl font-bold text-white tracking-tight">{user.name}</h2>
           {user.role === "ADMIN" && (
              <Badge variant="outline" className="w-fit border-purple-500/30 bg-purple-500/10 text-purple-400 mx-auto sm:mx-0">
                  Admin
              </Badge>
           )}
        </div>
        
        <div className="flex flex-col gap-2 text-neutral-400 text-sm">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="w-4 h-4 shrink-0" />
              {user.email}
          </div>
          {user.username && (
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <User className="w-4 h-4 shrink-0" />
                  @{user.username}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
