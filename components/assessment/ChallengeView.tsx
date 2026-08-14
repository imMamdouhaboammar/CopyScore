'use client';

import React, { useState, useEffect } from 'react';
import { HeadToHeadChallenge, FinalAssessmentScore, DOMAINS } from '@/lib/types/assessment';
import { Swords, Trophy, Target, ShieldCheck, ArrowRight, RotateCcw, Share2 } from 'lucide-react';

interface ChallengeViewProps {
  challengeCode: string;
  onAcceptChallenge: (code: string) => void;
  userCompletedScore?: FinalAssessmentScore;
}

export function ChallengeView({ challengeCode, onAcceptChallenge, userCompletedScore }: ChallengeViewProps) {
  const [challenge, setChallenge] = useState<HeadToHeadChallenge | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadChallenge() {
      setLoading(true);
      try {
        const res = await fetch(`/api/challenge/${challengeCode}`);
        const data = await res.json();
        if (data.challenge) {
          setChallenge(data.challenge);
        } else {
          // Fallback synthetic target if dynamic handle
          setChallenge({
            challengeCode,
            creatorHandle: challengeCode,
            creatorScore: 84,
            creatorArchetype: 'Message Strategist',
            creatorDomainScores: {
              conversion_copywriting: 88,
              content_creation: 79,
              performance_copy: 82,
              cro: 86,
            },
            createdAt: Date.now(),
            participantCount: 12,
          });
        }
      } catch (err) {
        console.error('Error fetching challenge', err);
      } finally {
        setLoading(false);
      }
    }

    loadChallenge();
  }, [challengeCode]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="font-mono text-sm text-[#0f0f11] flex items-center gap-2">
          <span className="animate-spin">⟳</span>
          <span>Loading Head-to-Head Arena...</span>
        </div>
      </div>
    );
  }

  const target = challenge || {
    challengeCode,
    creatorHandle: challengeCode,
    creatorScore: 84,
    creatorArchetype: 'Message Strategist',
    creatorDomainScores: {
      conversion_copywriting: 88,
      content_creation: 79,
      performance_copy: 82,
      cro: 86,
    },
    createdAt: 0,
    participantCount: 12,
  };

  const hasCompleted = !!userCompletedScore;
  const userWon = userCompletedScore && userCompletedScore.overallScore >= target.creatorScore;
  const diff = userCompletedScore ? userCompletedScore.overallScore - target.creatorScore : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <span className="patter-pill bg-[#0f0f11] text-white text-xs">
          HEAD-TO-HEAD DUEL
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0f0f11] tracking-tight">
          {hasCompleted ? (
            userWon ? 'Victory! You Beat The Challenger' : 'Challenge Match Completed'
          ) : (
            `Can You Beat @${target.creatorHandle}?`
          )}
        </h1>
        <p className="text-sm font-mono text-[#52525b]">
          {hasCompleted
            ? `Final head-to-head score comparison on identical assessment parameters.`
            : `@${target.creatorHandle} established an official benchmark score of ${target.creatorScore}/100.`}
        </p>
      </div>

      {/* Main Comparison or Invite Card */}
      <div className="patter-card bg-white p-6 sm:p-8 shadow-[6px_6px_0px_#0f0f11] border-[2px]">
        {/* Matchup Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center border-b-[1.5px] border-[#0f0f11] pb-6">
          {/* Challenger */}
          <div className="p-4 bg-[#fcfbf8] border-[1.5px] border-[#0f0f11] text-center space-y-2">
            <span className="patter-pill bg-[#0f0f11] text-white text-[10px]">CHALLENGER</span>
            <h3 className="font-mono font-bold text-lg text-[#0f0f11]">@{target.creatorHandle}</h3>
            <div className="font-mono font-extrabold text-4xl text-[#0f0f11]">{target.creatorScore} pts</div>
            <p className="text-xs font-mono text-[#52525b]">{target.creatorArchetype}</p>
          </div>

          {/* You */}
          <div className="p-4 bg-[#fcf4ee] border-[1.5px] border-[#0f0f11] text-center space-y-2">
            <span className="patter-pill bg-[#df9367] text-[#0f0f11] text-[10px] font-bold">YOU</span>
            <h3 className="font-mono font-bold text-lg text-[#0f0f11]">
              {userCompletedScore?.userHandle ? `@${userCompletedScore.userHandle}` : '@you'}
            </h3>
            <div className="font-mono font-extrabold text-4xl text-[#0f0f11]">
              {userCompletedScore ? `${userCompletedScore.overallScore} pts` : '? / 100'}
            </div>
            <p className="text-xs font-mono text-[#52525b]">
              {userCompletedScore ? userCompletedScore.archetype.name : 'Unattempted'}
            </p>
          </div>
        </div>

        {/* Post match comparison table if completed */}
        {hasCompleted && userCompletedScore && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 border-[1.5px] border-[#0f0f11] text-center font-mono font-bold text-sm ${
              userWon ? 'bg-[#eaf8ee] text-[#15803d]' : 'bg-[#fef4e6] text-[#b45309]'
            }`}>
              {diff > 0
                ? `You won by +${diff} points against @${target.creatorHandle}!`
                : diff === 0
                ? `Exact tie score of ${target.creatorScore} points!`
                : `@${target.creatorHandle} leads by ${Math.abs(diff)} points.`}
            </div>

            <div className="border border-[#0f0f11] overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="bg-[#0f0f11] text-white">
                    <th className="p-2.5">Domain</th>
                    <th className="p-2.5 text-center">YOU</th>
                    <th className="p-2.5 text-center">@{target.creatorHandle}</th>
                    <th className="p-2.5 text-right">Spread</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eeece4]">
                  {Object.entries(target.creatorDomainScores).map(([domainKey, targetVal]) => {
                    const meta = DOMAINS[domainKey as keyof typeof DOMAINS];
                    const userVal = userCompletedScore.domainScores[domainKey as keyof typeof DOMAINS]?.scaledScore || 0;
                    const domainDiff = userVal - targetVal;
                    return (
                      <tr key={domainKey} className="hover:bg-[#faf9f6]">
                        <td className="p-2.5 font-bold text-[#0f0f11]">{meta?.name || domainKey}</td>
                        <td className="p-2.5 text-center font-extrabold">{userVal}</td>
                        <td className="p-2.5 text-center text-[#52525b]">{targetVal}</td>
                        <td className={`p-2.5 text-right font-bold ${
                          domainDiff >= 0 ? 'text-[#15803d]' : 'text-[#b91c1c]'
                        }`}>
                          {domainDiff >= 0 ? `+${domainDiff}` : `${domainDiff}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 pt-4 text-center">
          {!hasCompleted ? (
            <button
              onClick={() => onAcceptChallenge(target.challengeCode)}
              className="w-full sm:w-auto patter-btn patter-btn-peach px-8 py-3.5 text-sm sm:text-base font-mono font-bold tracking-tight shadow-[3px_3px_0px_#0f0f11]"
            >
              <span className="flex items-center justify-center gap-2">
                <Swords className="w-5 h-5" />
                <span>Accept Challenge & Start Test</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          ) : (
            <button
              onClick={() => onAcceptChallenge(target.challengeCode)}
              className="patter-btn patter-btn-peach px-6 py-2.5 text-xs sm:text-sm font-mono font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Rematch / Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
