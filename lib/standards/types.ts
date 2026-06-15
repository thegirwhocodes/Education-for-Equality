export type AlignmentRelation = 'teaches' | 'supports' | 'assesses' | 'extends';

export type DeliveryMode = 'voice' | 'app' | 'print_bridge';

export type VoiceSuitability = 'voice_only' | 'voice_supported' | 'requires_visual_or_print';

export interface ExternalStandardRef {
  id: string;
  code?: string;
  framework: string;
  subject: string;
  stageOrBand?: string;
  strand?: string;
  theme?: string;
  topic?: string;
  description: string;
  relation: AlignmentRelation;
  verificationStatus: 'verified_official' | 'working_crosswalk' | 'needs_official_review';
  sourceUrl?: string;
  reviewNotes?: string;
}

export interface MasteryCriterion {
  id: string;
  description: string;
  evidence: string[];
}

export interface SabiSkill {
  id: string;
  subject: 'foundational-numeracy' | 'foundational-literacy' | 'mathematics' | 'english' | 'science';
  name: string;
  description: string;
  deliverySuitability: VoiceSuitability;
  prerequisiteSkillIds: string[];
  masteryCriteria: MasteryCriterion[];
  standardRefs: ExternalStandardRef[];
}

export interface SabiLessonAlignment {
  lessonId: string;
  title: string;
  pathway: 'foundational' | 'bridge' | 'grade-level';
  deliveryModes: DeliveryMode[];
  skillIds: string[];
  standardRefs: ExternalStandardRef[];
  voiceSuitability: VoiceSuitability;
  diagnosticSignals: string[];
  masteryEvidence: string[];
  notes?: string;
}

export interface SabiModuleAlignment {
  moduleId: string;
  title: string;
  pathway: 'foundational' | 'bridge' | 'grade-level';
  levelBand: string;
  lessonRange: string;
  deliveryModes: DeliveryMode[];
  skillIds: string[];
  standardRefs: ExternalStandardRef[];
  exitCriteria: MasteryCriterion[];
  notes?: string;
}
