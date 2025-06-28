import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { JWTPayload } from "jose";
import Link from "next/link";
import { LogOut, PenSquare, UserIcon } from "lucide-react";
import { toast } from "sonner";

interface UserProps {
    user: JWTPayload | null;
}

function UserMenu({ user }: UserProps) {
    const [isLoading, setIsloading] = useState(false);

    const handleLogout = async () => {
        setIsloading(true);
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                toast.success('Successfully logged out!');
                // Redirect to auth page after successful logout
                window.location.href = "/";
            } else {
                toast.error('Failed to logout. Please try again.');
                console.error('Logout failed:', res.statusText);
            }
        } catch (error) {
            toast.error('An error occurred during logout. Please try again.');
            console.error('Logout error:', error);
        } finally {
            setIsloading(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>
                            {(user as any)?.username?.charAt(0).toUpperCase() || 'User'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-bold">{(user as any)?.username}</p>
                        <p className="text-sm text-muted-foreground">{(user as any)?.email}</p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile" >
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/post/create-post" >
                        <PenSquare className="mr-2 h-4 w-4" />
                        <span>Create Post</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">

                    <LogOut className="mr-2 h-4 w-4" />
                    <span>
                        {
                            isLoading ? 'Logging Out...' : "Log Out"
                        }
                    </span>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu;