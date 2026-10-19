const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8');
const helpers = source.slice(source.indexOf('function workplaceShiftDate('), source.indexOf('const catchBackButton ='));
const c = vm.createContext({});
vm.runInContext(helpers, c);
test('Playa 7 AM–7 PM round trips independently of manager device zone', () => {
  const start = c.workplaceShiftDate('2026-10-25', '07:00', 'America/Cancun');
  const end = c.workplaceShiftDate('2026-10-25', '19:00', 'America/Cancun');
  assert.equal(start.toISOString(), '2026-10-25T12:00:00.000Z');
  assert.equal(end.toISOString(), '2026-10-26T00:00:00.000Z');
  const fields = c.getManagerShiftInputValues({startsAt:start.toISOString(),endsAt:end.toISOString(),workplaceTimeZone:'America/Cancun'});
  assert.equal(fields.date,'2026-10-25'); assert.equal(fields.startTime,'07:00'); assert.equal(fields.endTime,'19:00');
});
test('overnight rollover and midnight use the workplace calendar', () => {
 assert.equal(c.nextShiftDate('2026-12-31'),'2027-01-01');
 assert.equal(c.workplaceShiftDate(c.nextShiftDate('2026-10-25'),'00:00','America/Cancun').toISOString(),'2026-10-26T05:00:00.000Z');
});
test('DST gaps reject and repeated times choose earlier occurrence', () => {
 assert.throws(()=>c.workplaceShiftDate('2026-03-08','02:30','America/New_York'));
 assert.equal(c.workplaceShiftDate('2026-11-01','01:30','America/New_York').toISOString(),'2026-11-01T05:30:00.000Z');
});
const handlerStart = source.indexOf('if (managerSaveShiftButton) {', source.indexOf('if (managerCoverageRequestsButton) {'));
const handlerEnd = source.indexOf('\n  });\n}', handlerStart) + '\n  });\n}'.length;
const handler = source.slice(handlerStart, handlerEnd);
function setup(edit, zone='America/Cancun') {
 let save, payload, writes=0;
 const context = {authenticatedWorkplaceRole:'Manager',authenticatedWorkplaceId:'playa',authenticatedUserId:'manager',editingManagerShiftId:edit?'shift':null,
 managerSaveShiftButton:{textContent:'Save',addEventListener:(_,fn)=>save=fn},managerCreateShiftStatus:{},
 managerShiftWorkerSelect:{value:'steven'},managerShiftRoleInput:{value:'Host'},managerShiftDateInput:{value:'2026-10-25'},managerShiftStartInput:{value:'07:00'},managerShiftEndInput:{value:'19:00'},
 supabaseClient:{from:table=> table==='workplaces'?{select:()=>({eq:()=>({single:async()=>({data:zone?{time_zone:zone}:null,error:null})})})}:{insert:async p=>{writes++;payload=p;return {error:null};}},rpc:async(_,p)=>{writes++;payload=p;return {data:'shift',error:null};}},
 loadAuthenticatedTeamSchedule:async()=>{},setManagerShiftFormMode:()=>{},setActiveScheduleView:()=>{},window:{scrollTo:()=>{}}};
 vm.createContext(context);vm.runInContext(helpers,context);vm.runInContext(handler,context);
 return {context,save:()=>save(),payload:()=>payload,writes:()=>writes};
}
test('both create and edit save workplace instants', async()=>{
 for (const edit of [false,true]) {const t=setup(edit);await t.save();assert.equal(t.writes(),1);assert.equal(t.payload()[edit?'target_starts_at':'starts_at'],'2026-10-25T12:00:00.000Z');assert.equal(t.payload()[edit?'target_ends_at':'ends_at'],'2026-10-26T00:00:00.000Z');}
});
test('missing workplace zone prevents saving and allows retry',async()=>{
 const t=setup(true,null);await t.save();assert.equal(t.writes(),0);assert.equal(t.context.managerSaveShiftButton.disabled,false);
});

test('save handles overnight and until-close shifts',async()=>{
 const overnight=setup(true);overnight.context.managerShiftStartInput.value='19:00';overnight.context.managerShiftEndInput.value='07:00';await overnight.save();assert.equal(overnight.payload().target_ends_at,'2026-10-26T12:00:00.000Z');
 const close=setup(false);close.context.managerShiftEndInput.value='';await close.save();assert.equal(close.payload().ends_at,null);assert.equal(close.payload().end_label,'Close');
});
