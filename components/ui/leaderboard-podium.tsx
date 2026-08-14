"use client"

import * as React from "react"
import { Trophy, Crown, Medal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LeaderboardRanking {
  userId: string
  userName: string
  rank: number
  value: number | string
  avatarUrl?: string
  badge?: string
}

export interface LeaderboardPodiumProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: LeaderboardRanking[]
}

function formatValue(val: number | string): string {
  if (typeof val === "number") {
    return val.toLocaleString()
  }
  return String(val)
}

function getInitials(name: string): string {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function LeaderboardPodium({ rankings, className, ...props }: LeaderboardPodiumProps) {
  if (!rankings || rankings.length === 0) {
    return null
  }

  // Find 1st, 2nd, 3rd places
  const rank1 = rankings.find((r) => r.rank === 1) || rankings[0]
  const rank2 = rankings.find((r) => r.rank === 2) || rankings[1]
  const rank3 = rankings.find((r) => r.rank === 3) || rankings[2]

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2",
        className
      )}
      {...props}
    >
      {/* 2nd Place (Silver) */}
      <div className="flex flex-col items-center text-center">
        {rank2 ? (
          <>
            <div className="relative mb-2">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-[#52525b] bg-[#eeece4] flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-[#0f0f11] shadow-sm">
                {rank2.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rank2.avatarUrl}
                    alt={rank2.userName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(rank2.userName)
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#52525b] text-white text-[10px] font-bold shadow">
                2
              </span>
            </div>
            <p className="w-full truncate text-xs sm:text-sm font-semibold text-foreground px-1" title={rank2.userName}>
              {rank2.userName}
            </p>
            <p className="font-mono text-[11px] sm:text-xs font-bold text-muted-foreground mt-0.5">
              {formatValue(rank2.value)}
            </p>
            <div className="w-full mt-2 h-16 sm:h-20 bg-muted/60 border border-border/80 rounded-t-lg flex flex-col items-center justify-center">
              <Medal className="w-4 h-4 text-[#71717a] mb-0.5" />
              <span className="font-mono text-xs font-bold text-muted-foreground">2ND</span>
            </div>
          </>
        ) : (
          <div className="w-full h-16 sm:h-20 bg-muted/20 rounded-t-lg" />
        )}
      </div>

      {/* 1st Place (Gold / Crown) */}
      <div className="flex flex-col items-center text-center -translate-y-2">
        {rank1 ? (
          <>
            <div className="relative mb-2">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#df9367] mx-auto mb-1 animate-bounce" />
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-[#df9367] bg-[#fcf4ee] flex items-center justify-center font-mono font-black text-sm sm:text-base text-[#0f0f11] shadow-md ring-2 ring-[#df9367]/20">
                {rank1.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rank1.avatarUrl}
                    alt={rank1.userName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(rank1.userName)
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#df9367] text-[#0f0f11] text-xs font-black shadow border border-[#0f0f11]">
                1
              </span>
            </div>
            <p className="w-full truncate text-xs sm:text-sm font-bold text-foreground px-1" title={rank1.userName}>
              {rank1.userName}
            </p>
            <p className="font-mono text-xs sm:text-sm font-black text-[#df9367] mt-0.5">
              {formatValue(rank1.value)}
            </p>
            <div className="w-full mt-2 h-22 sm:h-26 bg-[#fcf4ee] border-2 border-[#df9367] rounded-t-xl flex flex-col items-center justify-center shadow-sm">
              <Trophy className="w-5 h-5 text-[#df9367] mb-0.5" />
              <span className="font-mono text-xs font-black text-[#0f0f11]">1ST PLACE</span>
            </div>
          </>
        ) : (
          <div className="w-full h-22 sm:h-26 bg-muted/20 rounded-t-xl" />
        )}
      </div>

      {/* 3rd Place (Bronze) */}
      <div className="flex flex-col items-center text-center">
        {rank3 ? (
          <>
            <div className="relative mb-2">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-[#c47648] bg-[#eeece4] flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-[#0f0f11] shadow-sm">
                {rank3.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rank3.avatarUrl}
                    alt={rank3.userName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(rank3.userName)
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-[#c47648] text-white text-[10px] font-bold shadow">
                3
              </span>
            </div>
            <p className="w-full truncate text-xs sm:text-sm font-semibold text-foreground px-1" title={rank3.userName}>
              {rank3.userName}
            </p>
            <p className="font-mono text-[11px] sm:text-xs font-bold text-muted-foreground mt-0.5">
              {formatValue(rank3.value)}
            </p>
            <div className="w-full mt-2 h-12 sm:h-16 bg-muted/60 border border-border/80 rounded-t-lg flex flex-col items-center justify-center">
              <Medal className="w-4 h-4 text-[#c47648] mb-0.5" />
              <span className="font-mono text-xs font-bold text-muted-foreground">3RD</span>
            </div>
          </>
        ) : (
          <div className="w-full h-12 sm:h-16 bg-muted/20 rounded-t-lg" />
        )}
      </div>
    </div>
  )
}
