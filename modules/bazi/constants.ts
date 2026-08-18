import type { EarthlyBranch, FiveElement, HeavenlyStem, YinYang } from '../../types/domain/bazi';

export const ENGINE_VERSION = 'bazi-engine-v1.0.0';
export const RULE_PROFILE_VERSION = 'civil-local-jieqi-v1';
export const MAPPING_VERSION = 'bazi-derived-baseline-v1';

export const STEMS: HeavenlyStem[] = ['jia','yi','bing','ding','wu','ji','geng','xin','ren','gui'];
export const BRANCHES: EarthlyBranch[] = ['zi','chou','yin','mao','chen','si','wu','wei','shen','you','xu','hai'];
export const ELEMENTS: FiveElement[] = ['wood','fire','earth','metal','water'];

export const STEM_CHINESE: Record<HeavenlyStem,string> = {
  jia:'甲', yi:'乙', bing:'丙', ding:'丁', wu:'戊', ji:'己', geng:'庚', xin:'辛', ren:'壬', gui:'癸',
};
export const BRANCH_CHINESE: Record<EarthlyBranch,string> = {
  zi:'子', chou:'丑', yin:'寅', mao:'卯', chen:'辰', si:'巳', wu:'午', wei:'未', shen:'申', you:'酉', xu:'戌', hai:'亥',
};
export const CHINESE_STEM = Object.fromEntries(Object.entries(STEM_CHINESE).map(([k,v])=>[v,k])) as Record<string,HeavenlyStem>;
export const CHINESE_BRANCH = Object.fromEntries(Object.entries(BRANCH_CHINESE).map(([k,v])=>[v,k])) as Record<string,EarthlyBranch>;

export const STEM_ELEMENT: Record<HeavenlyStem,FiveElement> = {
  jia:'wood', yi:'wood', bing:'fire', ding:'fire', wu:'earth', ji:'earth', geng:'metal', xin:'metal', ren:'water', gui:'water',
};
export const STEM_POLARITY: Record<HeavenlyStem,YinYang> = {
  jia:'yang', yi:'yin', bing:'yang', ding:'yin', wu:'yang', ji:'yin', geng:'yang', xin:'yin', ren:'yang', gui:'yin',
};
export const BRANCH_ELEMENT: Record<EarthlyBranch,FiveElement> = {
  zi:'water', chou:'earth', yin:'wood', mao:'wood', chen:'earth', si:'fire', wu:'fire', wei:'earth', shen:'metal', you:'metal', xu:'earth', hai:'water',
};
export const HIDDEN_STEMS: Record<EarthlyBranch,HeavenlyStem[]> = {
  zi:['gui'], chou:['ji','gui','xin'], yin:['jia','bing','wu'], mao:['yi'], chen:['wu','yi','gui'], si:['bing','wu','geng'],
  wu:['ding','ji'], wei:['ji','ding','yi'], shen:['geng','ren','wu'], you:['xin'], xu:['wu','xin','ding'], hai:['ren','jia'],
};

export const GENERATES: Record<FiveElement,FiveElement> = { wood:'fire', fire:'earth', earth:'metal', metal:'water', water:'wood' };
export const CONTROLS: Record<FiveElement,FiveElement> = { wood:'earth', earth:'water', water:'fire', fire:'metal', metal:'wood' };

export const PILLAR_NAMES = ['year','month','day','hour'] as const;
export type PillarName = typeof PILLAR_NAMES[number];
