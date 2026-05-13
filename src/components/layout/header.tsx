"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-indigo-600">作品集生成器</Link>
        <nav className="flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard"><Button variant="ghost" size="sm">我的项目</Button></Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>退出</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">登录</Button></Link>
              <Link href="/register"><Button size="sm">注册</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
