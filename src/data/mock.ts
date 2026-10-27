// Sample data copied from the design. Replace with API calls when the backend lands.

export const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const toNum = (v: string | number) => parseInt(String(v).replace(/[^\d]/g, ''), 10) || 0;

export type TaskMode = 'remote' | 'local' | 'hybrid';

export type Task = {
  id: number;
  title: string;
  budget: number;
  mode: TaskMode;
  effort: string;
  due: string;
  days: number;
  props: number;
  skills: string[];
  verified: boolean;
  where: string;
  dist?: number;
  x?: number; // map position, % of width
  y?: number; // map position, % of height
  age: number;
  match: number;
  cat: string;
};

export const TASKS: Task[] = [
  { id: 1, title: 'Shopify store setup for a handloom saree brand', budget: 12000, mode: 'remote', effort: '~20 hrs', due: '9 Nov', days: 14, props: 4, skills: ['Shopify'], verified: true, where: 'Jaipur', age: 2, match: 96, cat: 'Development' },
  { id: 2, title: 'Fix checkout bug on a React + Razorpay site', budget: 3500, mode: 'remote', effort: '~4 hrs', due: '30 Oct', days: 4, props: 2, skills: ['React'], verified: true, where: 'Gurugram', age: 1, match: 91, cat: 'Development' },
  { id: 3, title: "Laptop won't boot — fix at home", budget: 900, mode: 'local', effort: '~2 hrs', due: 'tomorrow', days: 1, props: 1, skills: ['Hardware'], verified: true, where: 'Kothrud', dist: 2.1, x: 36, y: 40, age: 0, match: 70, cat: 'Tech support' },
  { id: 4, title: 'Landing page for a yoga studio', budget: 7500, mode: 'hybrid', effort: '~12 hrs', due: '15 Nov', days: 20, props: 5, skills: ['Webflow'], verified: false, where: 'Baner', dist: 6.8, x: 22, y: 22, age: 3, match: 88, cat: 'Development' },
  { id: 5, title: 'Product photos for 25 brass diyas', budget: 6500, mode: 'local', effort: '1 day', due: '12 Nov', days: 17, props: 3, skills: ['Photography'], verified: true, where: 'Aundh', dist: 5.4, x: 70, y: 28, age: 4, match: 54, cat: 'Photography' },
  { id: 6, title: 'Office Wi-Fi setup — 3 access points', budget: 5000, mode: 'local', effort: '~6 hrs', due: '2 Nov', days: 7, props: 0, skills: ['Networking'], verified: true, where: 'Karve Nagar', dist: 3.2, x: 62, y: 66, age: 0, match: 64, cat: 'Tech support' },
  { id: 7, title: 'Edit 6 Instagram Reels for a café launch', budget: 4800, mode: 'remote', effort: '~10 hrs', due: '3 Nov', days: 8, props: 7, skills: ['Video editing'], verified: false, where: 'Kochi', age: 2, match: 48, cat: 'Video editing' },
  { id: 8, title: 'Electrician: rewire 2 switchboards + fan', budget: 1800, mode: 'local', effort: '~3 hrs', due: '29 Oct', days: 3, props: 2, skills: ['Electrical'], verified: true, where: 'Warje', dist: 4.6, x: 28, y: 74, age: 0, match: 40, cat: 'Home services' },
  { id: 9, title: 'Port a Wix site to Next.js', budget: 18000, mode: 'remote', effort: '~35 hrs', due: '28 Nov', days: 33, props: 9, skills: ['React'], verified: true, where: 'Mumbai', age: 5, match: 93, cat: 'Development' },
  { id: 10, title: 'Python tutor for Class 12 — 8 sessions', budget: 4000, mode: 'remote', effort: '8 × 1 hr', due: 'this week', days: 6, props: 1, skills: ['Tutoring'], verified: true, where: 'Nashik', age: 1, match: 60, cat: 'Tutoring' },
];

export const ARRIVING_TASK: Task = {
  id: 11, title: 'WordPress speed fix for a dental clinic', budget: 2800, mode: 'remote', effort: '~3 hrs', due: '1 Nov', days: 5, props: 0, skills: ['WordPress'], verified: true, where: 'Indore', age: 0, match: 90, cat: 'Development',
};

export const modeLabel = (t: Task) =>
  t.mode === 'remote' ? 'Remote' : (t.mode === 'hybrid' ? 'Hybrid · ' : 'On-site · ') + t.dist + ' km';

export const CATEGORIES = ['Development', 'Design', 'Video editing', 'Writing', 'Tutoring', 'Tech support', 'Home services', 'Photography'];

export type NoteCat = 'Opportunities' | 'Proposals' | 'Contracts' | 'Messages' | 'Payments' | 'Disputes';
export const NOTIFICATIONS: { id: number; cat: NoteCat; text: string; time: string; icon: string }[] = [
  { id: 1, cat: 'Opportunities', text: '3 new Shopify tasks match your skills (₹5,000+)', time: '12 min', icon: 'explore' },
  { id: 2, cat: 'Messages', text: 'Rohan: “Can product pages show both cotton and silk?”', time: '40 min', icon: 'msg' },
  { id: 3, cat: 'Contracts', text: 'Milestone 1 approved by Mehta Handlooms', time: '2 h', icon: 'work' },
  { id: 4, cat: 'Payments', text: 'Milestone 1 payout is processing with [PAYMENT PARTNER]', time: '2 h', icon: 'pay' },
  { id: 5, cat: 'Proposals', text: 'Kabir Sethi sent a proposal on your explainer task', time: 'Yesterday', icon: 'up' },
  { id: 6, cat: 'Disputes', text: 'Support replied on case #TK-2291 · respond by 29 Oct', time: 'Mon', icon: 'shield' },
];

export const WORKERS = [
  { name: 'Kabir Sethi', ini: 'KS', bg: '#D6E2F0', role: 'Video editor · Delhi', proof: '9 verified tasks' },
  { name: 'Meera Pillai', ini: 'MP', bg: '#EBD6E6', role: 'Motion & edit · Kochi', proof: 'New · strong portfolio' },
  { name: 'Tanvi Rao', ini: 'TR', bg: '#F0D9B5', role: 'Explainers · Hyderabad', proof: '21 verified tasks' },
];

export type Proposal = {
  id: string; name: string; ini: string; bg: string; city: string; price: number; days: number;
  rating: string; isNew?: boolean; reply: string; comm: string; exp: string; pitch: string;
  thumbs: [string, string][]; ms: string; fit: number;
};

export const PROPOSALS: Proposal[] = [
  { id: 'kabir', name: 'Kabir Sethi', ini: 'KS', bg: '#D6E2F0', city: 'Delhi', price: 7500, days: 5, rating: '4.8 from 9 verified tasks', reply: 'Replies ~1 hr', comm: 'answered your licensing question', exp: '6 explainers for SaaS and agencies', pitch: "I'll cut your script to 90s with kinetic captions in your brand fonts and licensed music. Two revision rounds.", thumbs: [['#D6E2F0', '#7E9CC4'], ['#E9D8B8', '#C99A5B'], ['#DDE7D0', '#8FAF6A']], ms: 'Rough cut ₹3,000 · Final ₹4,500', fit: 92 },
  { id: 'meera', name: 'Meera Pillai', ini: 'MP', bg: '#EBD6E6', city: 'Kochi', price: 6000, days: 6, rating: 'New on Taskora · no ratings yet', isNew: true, reply: 'Replies ~2 hrs', comm: 'asked two sharp audience questions', exp: 'Motion-design grad; 3 startup explainers', pitch: 'Storyboard first so you approve the flow before animation. Happy to add a Hindi or Malayalam subtitle track.', thumbs: [['#EBD6E6', '#B98AB0'], ['#F2D6C9', '#C7735A'], ['#D6E2F0', '#6E8FC0']], ms: 'Storyboard ₹1,500 · Animation ₹3,000 · Final ₹1,500', fit: 88 },
  { id: 'tanvi', name: 'Tanvi Rao', ini: 'TR', bg: '#F0D9B5', city: 'Hyderabad', price: 8000, days: 4, rating: '4.9 from 21 verified tasks', reply: 'Replies ~3 hrs', comm: 'shared a short walkthrough of her plan', exp: '14 explainers, mostly fintech; VO sync', pitch: 'Fastest turnaround with a Hindi + English voice-over option. Files in 16:9 and 9:16.', thumbs: [['#F0D9B5', '#D19A4F'], ['#D9E4C4', '#9DBB6A'], ['#E5E5DF', '#9A9A92']], ms: 'Single milestone ₹8,000', fit: 90 },
  { id: 'imran', name: 'Imran Sheikh', ini: 'IS', bg: '#DDE7D0', city: 'Lucknow', price: 6800, days: 7, rating: '4.5 from 4 verified tasks', reply: 'Replies ~6 hrs', comm: "general proposal, didn't reference the brief", exp: 'YouTube editing; 1 explainer', pitch: 'Experienced editor, can deliver high quality video for your needs.', thumbs: [['#DDE7D0', '#7F9F5A']], ms: 'Half upfront ₹3,400 · Final ₹3,400', fit: 61 },
];

export type Msg =
  | { day: string }
  | { event: string }
  | { id?: number; dir: 'in' | 'out'; text?: string; file?: string; meta?: string; st?: string };

export type Convo = {
  name: string; first: string; ini: string; bg: string; sub: string; task: string; ctx: string;
  state: string; stateTone: 'lime' | 'info' | 'neutral'; href: string; time: string; msgs: Msg[];
};

export const CONVOS: Convo[] = [
  { name: 'Rohan Mehta', first: 'Rohan', ini: 'RM', bg: '#F0D9B5', sub: 'Customer · usually replies in 1h', task: 'Shopify store · Mehta Handlooms', ctx: 'Milestone 2 of 3 · Payment collected', state: '▶ In progress', stateTone: 'lime', href: '/contract', time: '6:40 pm', msgs: [{ day: 'Yesterday' }, { dir: 'in', text: 'Sharing the colour names for the silk range.' }, { dir: 'in', file: 'silk-colours.xlsx', meta: 'Spreadsheet · 14 KB' }, { dir: 'out', text: 'Perfect, adding them now. 28 of 40 in.', st: 'Read' }, { day: 'Today' }, { event: 'Payment for milestone 2 confirmed · simulated' }, { dir: 'in', text: 'Can the product pages show both cotton and silk variants?' }, { dir: 'out', text: "Yes — I'll add a fabric selector. It's within milestone 2, no scope change.", st: 'Delivered' }] },
  { name: 'Sneha Kulkarni', first: 'Sneha', ini: 'SK', bg: '#D6E2F0', sub: 'Customer · Kothrud', task: "Laptop won't boot", ctx: 'Your proposal: ₹900', state: '◔ Proposal sent', stateTone: 'info', href: '/task/3', time: '2:15 pm', msgs: [{ day: 'Today' }, { dir: 'out', text: 'I can come by tomorrow evening with a recovery USB. Is 7 pm okay?', st: 'Read' }, { dir: 'in', text: 'Is 7 pm tomorrow okay for you? Visitor parking is available.' }] },
  { name: 'Taskora Support', first: 'Support', ini: 'T', bg: '#C6F36A', sub: 'Trust & Safety', task: 'Payout method', ctx: 'Bank verification', state: 'Open', stateTone: 'neutral', href: '/earnings', time: 'Mon', msgs: [{ day: 'Monday' }, { dir: 'in', text: 'Your UPI ID is being verified by [PAYMENT PARTNER]. Usually 1–2 working days.' }] },
  { name: 'Diya Crafts Co.', first: 'Diya Crafts', ini: 'DC', bg: '#EBD6E6', sub: 'Customer · Aundh', task: 'Product photos · 25 diyas', ctx: 'Your proposal: ₹6,000', state: '◔ Proposal sent', stateTone: 'info', href: '/explore', time: 'Sun', msgs: [{ day: 'Sunday' }, { dir: 'in', text: 'Thanks for the proposal! Do you bring your own lights?' }] },
];

export const PORTFOLIO = [
  { id: 'a', title: 'Kaarigar handloom store', sub: 'Shopify · Jaipur', g: ['#E9D8B8', '#C99A5B'] },
  { id: 'b', title: 'Chai Sutra landing page', sub: 'Next.js · Pune', g: ['#F2D6C9', '#C7735A'] },
  { id: 'c', title: 'Razorpay + COD checkout', sub: 'Payments · 3 stores', g: ['#D9E4C4', '#8FAF6A'] },
  { id: 'd', title: 'Silver jewellery catalogue', sub: 'Shopify · Mumbai', g: ['#D6E2F0', '#7E9CC4'] },
] as { id: string; title: string; sub: string; g: [string, string] }[];
