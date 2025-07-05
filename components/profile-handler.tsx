import React from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import SignOutForm from "@/components/auth/sign-out-form";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import type {User} from "@/lib/types";

type UserProps = {
    user: User | null
}

const ProfileHandler = ({ user }: UserProps) => {
    return (
        <div className="flex items-center gap-3 p-3 border-l ">
            <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={user?.image || ""} alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name ? user.name.charAt(0) : '?'}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none">
                    {user?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                </p>
            </div>
            <SignOutForm>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="flex items-center cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                </Button>
            </SignOutForm>
        </div>

    );
};

export default ProfileHandler;