import { ArchetypeProfile, DomainId } from '../types/assessment';

export const ARCHETYPES: Record<string, ArchetypeProfile> = {
  message_strategist: {
    id: 'message_strategist',
    name: 'Message Strategist',
    tagline: 'Architect of awareness, proof systems & core value hierarchy',
    badge: 'STRATEGIST',
    description: 'You diagnose audience psychology before touching a headline. You excel at matching stage-of-awareness with proof architecture and ruthlessly ordering arguments for maximum conviction.',
    superpower: 'Structuring high-friction propositions so clearly that objections dissolve before the CTA is reached.',
    blindspot: 'Occasionally prioritizing structural perfection over raw, high-velocity creative experimentation in paid channels.',
    dominantDomains: ['conversion_copywriting', 'cro'],
  },
  response_driver: {
    id: 'response_driver',
    name: 'Response Driver',
    tagline: 'High-velocity intent capture & conversion momentum',
    badge: 'RESPONSE',
    description: 'You understand that copy exists to generate immediate, measurable action. Your writing cuts through indifference with punchy framing, strong stakes, and high-urgency friction killers.',
    superpower: 'Turning lukewarm curiosity into decisive click-throughs and conversions under tight character constraints.',
    blindspot: 'Risk of burning audience goodwill or misaligning post-click expectations if the upstream hook outpaces the actual offer.',
    dominantDomains: ['performance_copy', 'conversion_copywriting'],
  },
  conversion_diagnostician: {
    id: 'conversion_diagnostician',
    name: 'Conversion Diagnostician',
    tagline: 'Friction hunter & evidence-led experiment architect',
    badge: 'DIAGNOSTICIAN',
    description: 'You treat landing pages as behavioural crime scenes. You spot why visitors drop off at form fields, recognize trust deficits instantly, and formulate high-leverage test hypotheses.',
    superpower: 'Isolating the single critical friction barrier that unblocks 30%+ conversion lifts before rewriting whole pages.',
    blindspot: 'Can become overly cautious, demanding excessive data before testing bolder creative leaps.',
    dominantDomains: ['cro', 'conversion_copywriting'],
  },
  sharp_editor: {
    id: 'sharp_editor',
    name: 'Sharp Editor',
    tagline: 'Master of cognitive pacing, word economy & lethal clarity',
    badge: 'EDITOR',
    description: 'You strip away fluff, jargon, and bloated sentence structures. Your copy glides effortlessly into the reader\'s mind because every syllable earns its place.',
    superpower: 'Compressing complex 40-word enterprise claims into 8-word punchy, memorable lines without losing specificity.',
    blindspot: 'May over-polish copy and cut visceral, emotional edge in favor of clean grammatical symmetry.',
    dominantDomains: ['content_creation', 'conversion_copywriting'],
  },
  performance_thinker: {
    id: 'performance_thinker',
    name: 'Performance Thinker',
    tagline: 'Creative angle multiplier & message-market hypothesis tester',
    badge: 'PERFORMANCE',
    description: 'You think in systems of creative angles. You understand audience segmentation, ad-to-page message matching, and how to iterate based on retention curves and conversion signals.',
    superpower: 'Generating 5 radically distinct psychological angles for the same product instead of 5 slight headline tweaks.',
    blindspot: 'Can undervalue deep narrative storytelling when short-form direct response signals look temporarily strong.',
    dominantDomains: ['performance_copy', 'cro'],
  },
  content_architect: {
    id: 'content_architect',
    name: 'Content Architect',
    tagline: 'Hook engineer, narrative sequencing & retention master',
    badge: 'ARCHITECT',
    description: 'You master the art of the hook, curiosity loops, and cognitive rhythm. You know how to stop a distracted thumb in 1.2 seconds and carry reader attention down an entire sequence.',
    superpower: 'Engineering compelling hooks and story arcs that hold engagement through deep educational and narrative content.',
    blindspot: 'Sometimes softens direct buying tension by over-indexing on educational value.',
    dominantDomains: ['content_creation', 'performance_copy'],
  },
  balanced_operator: {
    id: 'balanced_operator',
    name: 'Balanced Operator',
    tagline: 'Full-stack commercial writer with versatile cross-discipline judgment',
    badge: 'FULL-STACK',
    description: 'You possess robust, balanced judgment across the entire commercial writing funnel—from initial hook to conversion architecture and experimentation.',
    superpower: 'Seamlessly bridging the gap between performance ads, long-form landing pages, and quantitative CRO testing.',
    blindspot: 'Risk of acting as a generalist when a situation demands radical specialization in one extreme tactic.',
    dominantDomains: ['conversion_copywriting', 'content_creation', 'performance_copy', 'cro'],
  },
};

export function determineArchetype(domainScores: Record<DomainId, number>): ArchetypeProfile {
  const scores = [
    { domain: 'conversion_copywriting' as DomainId, score: domainScores.conversion_copywriting || 0 },
    { domain: 'content_creation' as DomainId, score: domainScores.content_creation || 0 },
    { domain: 'performance_copy' as DomainId, score: domainScores.performance_copy || 0 },
    { domain: 'cro' as DomainId, score: domainScores.cro || 0 },
  ].sort((a, b) => b.score - a.score);

  const top1 = scores[0];
  const top2 = scores[1];
  const scoreSpread = top1.score - scores[3].score;

  // If scores are all very close (within 7 points) and high, Balanced Operator
  if (scoreSpread <= 8 && top1.score >= 60) {
    return ARCHETYPES.balanced_operator;
  }

  // Check top 2 combinations
  if (
    (top1.domain === 'conversion_copywriting' && top2.domain === 'cro') ||
    (top1.domain === 'cro' && top2.domain === 'conversion_copywriting')
  ) {
    return top1.domain === 'cro' ? ARCHETYPES.conversion_diagnostician : ARCHETYPES.message_strategist;
  }

  if (
    (top1.domain === 'performance_copy' && top2.domain === 'conversion_copywriting') ||
    (top1.domain === 'conversion_copywriting' && top2.domain === 'performance_copy')
  ) {
    return ARCHETYPES.response_driver;
  }

  if (
    (top1.domain === 'content_creation' && top2.domain === 'conversion_copywriting') ||
    (top1.domain === 'conversion_copywriting' && top2.domain === 'content_creation')
  ) {
    return ARCHETYPES.sharp_editor;
  }

  if (
    (top1.domain === 'performance_copy' && top2.domain === 'cro') ||
    (top1.domain === 'cro' && top2.domain === 'performance_copy')
  ) {
    return ARCHETYPES.performance_thinker;
  }

  if (
    (top1.domain === 'content_creation' && top2.domain === 'performance_copy') ||
    (top1.domain === 'performance_copy' && top2.domain === 'content_creation')
  ) {
    return ARCHETYPES.content_architect;
  }

  // Fallbacks based on highest single domain
  switch (top1.domain) {
    case 'conversion_copywriting':
      return ARCHETYPES.message_strategist;
    case 'cro':
      return ARCHETYPES.conversion_diagnostician;
    case 'performance_copy':
      return ARCHETYPES.response_driver;
    case 'content_creation':
      return ARCHETYPES.content_architect;
    default:
      return ARCHETYPES.balanced_operator;
  }
}
