const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname,'../script.js'),'utf8');
const refreshSource = source.slice(source.indexOf('let industryScheduleRefreshTimer ='),source.indexOf('window.addEventListener("online", refreshIndustrySchedule)'));
function makeContext(extra = {}) {
  let calls = 0;
  const c = { authenticatedUserId:'worker', authenticatedWorkplaceId:'workplace', authenticatedWorkplaceRole:'Server', document:{hidden:false}, navigator:{onLine:true}, selectedReleaseShift:{id:'transferred'}, authenticatedScheduleShifts:[], setActiveScheduleView:view=>c.view=view, updateDashboardForRole:()=>{}, renderActivityFeed:()=>{}, ...extra };
  for (const name of ['loadAuthenticatedSchedule','loadAuthenticatedCatchShifts','loadAuthenticatedShiftInterests','loadAuthenticatedCoverageEvents','loadAndRenderDirectShiftOffers','loadAndRenderManagerDirectApprovals','loadAuthenticatedManagerCrew','loadAuthenticatedTeamSchedule']) c[name] ||= async()=>{calls++;};
  vm.createContext(c); vm.runInContext(refreshSource,c);
  return {c,calls:()=>calls};
}
test('refresh removes a transferred shift from the former owner view without changing sign-in', async()=>{
 const {c,calls}=makeContext(); await c.refreshIndustrySchedule(); assert.equal(c.selectedReleaseShift,null); assert.equal(c.view,'my-shifts'); assert.equal(c.authenticatedUserId,'worker'); assert.equal(calls(),7);
});
test('background/offline/signed-out views do not poll',async()=>{
 for(const extra of [{document:{hidden:true}},{navigator:{onLine:false}},{authenticatedUserId:null}]) {const {c,calls}=makeContext(extra);await c.refreshIndustrySchedule();assert.equal(calls(),0);}
});
test('overlapping refresh triggers coalesce; later refresh works',async()=>{
 let release;const gate=new Promise(r=>release=r);let loads=0;
 const {c}=makeContext({loadAuthenticatedSchedule:async()=>{loads++;await gate;}});
 const a=c.refreshIndustrySchedule(),b=c.refreshIndustrySchedule();assert.equal(loads,1);release();await Promise.all([a,b]);await c.refreshIndustrySchedule();assert.equal(loads,2);
});
test('temporary refresh failure permits subsequent retry',async()=>{
 let attempts=0;const {c}=makeContext({loadAuthenticatedSchedule:async()=>{if(++attempts===1)throw Error('offline');}});
 await c.refreshIndustrySchedule();await c.refreshIndustrySchedule();assert.equal(attempts,2);assert.equal(c.authenticatedUserId,'worker');
});
const restoreSource=source.slice(source.indexOf('async function restoreIndustrySession()'),source.indexOf('async function initializeIndustryAuth()'));
test('saved session enters authenticated view without signed-out flash',async()=>{
 let entered=0,signedOut=0;const c={passwordRecoveryActive:false,supabaseClient:{auth:{getSession:async()=>({data:{session:{}},error:null})}},enterAuthenticatedIndustry:async()=>entered++,showSignedOutIndustry:()=>signedOut++};vm.createContext(c);vm.runInContext(restoreSource,c);await c.restoreIndustrySession();assert.equal(entered,1);assert.equal(signedOut,0);
});
test('session load failure does not clear session or present signed-out state',async()=>{
 let signedOut=0;const c={passwordRecoveryActive:false,supabaseClient:{auth:{getSession:async()=>({data:{session:null},error:Error('network')})}},showSignedOutIndustry:()=>signedOut++};vm.createContext(c);vm.runInContext(restoreSource,c);await assert.rejects(c.restoreIndustrySession());assert.equal(signedOut,0);
});
test('loading screen stays up until restoration finishes and offers retry after failure',async()=>{
 const loading = new Set();const status={textContent:''};const retry={hidden:true,addEventListener(){}};let release;
 const c={document:{body:{classList:{add:x=>loading.add(x),remove:x=>loading.delete(x)}},querySelector:id=>id==='#industry-session-status'?status:retry},loadPilotInvitation:async()=>{},restoreIndustrySession:()=>new Promise(r=>release=r)};
 vm.createContext(c);vm.runInContext(source.slice(source.indexOf('async function initializeIndustryAuth()'),source.indexOf('\ninitializeIndustryAuth();')),c);
 const pending=c.initializeIndustryAuth();await new Promise(setImmediate);assert.equal(loading.has('industry-session-loading'),true);release();await pending;assert.equal(loading.has('industry-session-loading'),false);
 c.restoreIndustrySession=async()=>{throw Error('offline');};await c.initializeIndustryAuth();assert.equal(loading.has('industry-session-loading'),true);assert.equal(retry.hidden,false);assert.match(status.textContent,/has not been cleared/);
});
test('temporary profile lookup failure propagates without declaring no workplace',async()=>{
 const c={supabaseClient:{auth:{getUser:async()=>({data:{user:{id:'worker'}},error:null})},from:()=>({select:()=>({eq:()=>({single:async()=>({error:Error('offline')})})})})}};
 vm.createContext(c);vm.runInContext(source.slice(source.indexOf('async function loadAuthenticatedIndustryProfile()'),source.indexOf('// Mobile browsers can suspend sockets')),c);await assert.rejects(c.loadAuthenticatedIndustryProfile());
});
