const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../script.js'),'utf8');
const loader=source.slice(source.indexOf('async function loadAuthenticatedManagerCrew('),source.indexOf('function renderAuthenticatedManagerCrew('));
function setup(load) {
 const select={value:'steven',options:[{value:'steven'}],replaceChildren(fragment){this.options=fragment.children;this.value='';}};
 const c={managerShiftWorkerSelect:select,authenticatedWorkplaceRole:'Manager',authenticatedWorkplaceId:'playa',authenticatedManagerCrew:[{id:'steven'}],managerCreateShiftStatus:{textContent:'Shift updated.'},loadAuthenticatedWorkplaceCrew:load,document:{createDocumentFragment:()=>({children:[],appendChild(o){this.children.push(o);}}),createElement:()=>({})}};
 vm.createContext(c);vm.runInContext(loader,c);return c;
}
const crew=[{id:'steven',name:'Steven',role:'Host'},{id:'chilo',name:'Chiloquin',role:'Server'}];
test('repeated background refresh preserves selected worker and status',async()=>{
 const c=setup(async()=>crew);for(let i=0;i<3;i++){await c.loadAuthenticatedManagerCrew({background:true});assert.equal(c.managerShiftWorkerSelect.value,'steven');assert.equal(c.managerCreateShiftStatus.textContent,'Shift updated.');}assert.equal(c.managerShiftWorkerSelect.options.length,4);
});
test('selection changed during request wins over old selection',async()=>{
 let resolve;const c=setup(()=>new Promise(r=>resolve=r));const p=c.loadAuthenticatedManagerCrew({background:true});assert.equal(c.managerShiftWorkerSelect.value,'steven');c.managerShiftWorkerSelect.value='chilo';resolve(crew);await p;assert.equal(c.managerShiftWorkerSelect.value,'chilo');
});
test('Open Shift and empty selection survive refresh',async()=>{
 for(const value of ['open','']){const c=setup(async()=>crew);c.managerShiftWorkerSelect.value=value;await c.loadAuthenticatedManagerCrew();assert.equal(c.managerShiftWorkerSelect.value,value);}
});
test('removed worker is cleared and new crew are available',async()=>{
 const c=setup(async()=>[crew[1]]);await c.loadAuthenticatedManagerCrew({background:true});assert.equal(c.managerShiftWorkerSelect.value,'');assert.equal(c.managerShiftWorkerSelect.options[2].value,'chilo');
});
test('network failure preserves previous list, selection and background status',async()=>{
 const c=setup(async()=>{throw Error('offline');});await c.loadAuthenticatedManagerCrew({background:true});assert.equal(c.managerShiftWorkerSelect.value,'steven');assert.equal(c.authenticatedManagerCrew.length,1);assert.equal(c.managerCreateShiftStatus.textContent,'Shift updated.');
});
test('stale workplace response does not overwrite form',async()=>{
 let resolve;const c=setup(()=>new Promise(r=>resolve=r));const p=c.loadAuthenticatedManagerCrew({background:true});c.authenticatedWorkplaceId='other';resolve(crew);await p;assert.equal(c.managerShiftWorkerSelect.options.length,1);
});
