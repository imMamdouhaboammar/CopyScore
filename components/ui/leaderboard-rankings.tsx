"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LeaderboardRankingItem {
  userId: string
  rank: number
  userName: string
  byline?: string
  value: number | string
  displayed?: boolean
  avatarUrl?: string
  badge?: string
}

export interface LeaderboardRankingsProps extends React.HTMLAttributes<HTMLDivElement> {
  rankings: LeaderboardRankingItem[]
  currentUserId?: string
  showPagination?: boolean
  defaultPageSize?: number
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

export function LeaderboardRankings({
  rankings,
  currentUserId,
  showPagination = false,
  defaultPageSize = 10,
  className,
  ...props
}: LeaderboardRankingsProps) {
  const [currentPage, setCurrentPage] = React.useState(1)

  const visibleRankings = React.useMemo(() => {
    return rankings.filter((item) => item.displayed !== false)
  }, [rankings])

  const totalPages = Math.ceil(visibleRankings.length / defaultPageSize) || 1

  const pagedRankings = React.useMemo(() => {
    if (!showPagination) return visibleRankings
    const start = (currentPage - 1) * defaultPageSize
    return visibleRankings.slice(start, start + defaultPageSize)
  }, [visibleRankings, showPagination, currentPage, defaultPageSize])

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="divide-y rounded-xl border bg-background/50 overflow-hidden">
        {pagedRankings.map((item) => {
          const isCurrentUser = currentUserId && item.userId === currentUserId
          return (
            <div
              key={item.userId}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-3 transition-colors",
                isCurrentUser
                  ? "bg-[#df9367]/10 font-medium ring-1 ring-inset ring-[#df9367]/30"
                  : "hover:bg-muted/40"
              )}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold",
                    item.rank === 1
                      ? "bg-[#df9367] text-[#0f0f11]"
                      : item.rank === 2
                      ? "bg-[#52525b] text-white"
                      : item.rank === 3
                      ? "bg-[#c47648] text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  #{item.rank}
                </div>

                {/* Avatar */}
                <div className="h-8 w-8 shrink-0 rounded-full bg-muted border flex items-center justify-center font-mono text-xs font-semibold text-foreground overflow-hidden">
                  {item.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatarUrl}
                      alt={item.userName}
                      className="h-full w-full object-cover"
                    />
                  ) : item.userName ? (
                    getInitials(item.userName)
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                {/* Name & Byline */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {item.userName}
                    </span>
                    {isCurrentUser && (
                      <span className="rounded bg-[#df9367] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#0f0f11]">
                        YOU
                      </span>
                    )}
                  </div>
                  {item.byline && (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.byline}
                    </p>
                  )}
                </div>
              </div>

              {/* Value / Score */}
              <div className="shrink-0 text-right">
                <span className="font-mono text-sm font-bold text-foreground">
                  {formatValue(item.value)}
                </span>
              </div>
            </div>
          )
        })}

        {pagedRankings.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No rankings to display.
          </div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 px-1 text-xs">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </button>

          <span className="font-mono text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
