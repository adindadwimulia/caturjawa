const board=document.getElementById("board");
const message=document.getElementById("message");
const turnEl=document.getElementById("turn");
const redCount=document.getElementById("redCount");
const blueCount=document.getElementById("blueCount");
const reset=document.getElementById("reset");

const N=8;
let pieces=[],turn="red",selected=null,over=false;

function start(){
  pieces=[]; turn="red"; selected=null; over=false;
  for(let r=0;r<3;r++)for(let c=0;c<N;c++)if((r+c)%2===1)pieces.push({r,c,team:"red"});
  for(let r=5;r<8;r++)for(let c=0;c<N;c++)if((r+c)%2===1)pieces.push({r,c,team:"blue"});
  message.textContent="🔴 Pilih bidak merah untuk mulai.";
  draw();
}

function at(r,c){return pieces.find(p=>p.r===r&&p.c===c)}

function valid(p,r,c){
  if(r<0||r>=N||c<0||c>=N||at(r,c))return false;
  const dr=r-p.r,dc=c-p.c;
  if(Math.abs(dr)===1&&Math.abs(dc)===1)return true;
  if(Math.abs(dr)===2&&Math.abs(dc)===2){
    const mid=at((r+p.r)/2,(c+p.c)/2);
    return !!mid&&mid.team!==p.team;
  }
  return false;
}

function draw(){
  board.innerHTML="";
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const cell=document.createElement("div");
    cell.className="cell "+((r+c)%2?"dark":"light");
    cell.dataset.r=r;cell.dataset.c=c;
    const p=at(r,c);
    if(selected&&selected.r===r&&selected.c===c)cell.classList.add("selected");
    if(selected&&valid(selected,r,c))cell.classList.add("valid");
    if(p){
      const el=document.createElement("div");
      el.className="piece "+p.team;
      el.textContent="♟";
      cell.appendChild(el);
    }
    cell.onclick=()=>clickCell(r,c);
    board.appendChild(cell);
  }
  redCount.textContent=pieces.filter(p=>p.team==="red").length+" bidak";
  blueCount.textContent=pieces.filter(p=>p.team==="blue").length+" bidak";
  turnEl.textContent=turn==="red"?"Merah":"Biru";
}

function clickCell(r,c){
  if(over)return;
  const p=at(r,c);

  if(!selected){
    if(p&&p.team===turn){selected=p;message.textContent="🎯 Bidak dipilih. Klik kotak yang disorot.";draw();}
    else message.textContent="⚠️ Pilih bidak milik pemain yang sedang mendapat giliran.";
    return;
  }

  if(p&&p.team===turn){selected=p;draw();return}

  if(!valid(selected,r,c)){
    message.textContent="❌ Gerakan itu tidak bisa dilakukan.";
    return;
  }

  const dr=r-selected.r,dc=c-selected.c;
  if(Math.abs(dr)===2){
    const mid=pieces.findIndex(x=>x.r===(r+selected.r)/2&&x.c===(c+selected.c)/2);
    if(mid>=0)pieces.splice(mid,1);
  }

  selected.r=r;selected.c=c;
  const winner=pieces.filter(x=>x.team!==turn).length===0;
  selected=null;

  if(winner){
    over=true;
    message.textContent=(turn==="red"?"🔴":"🔵")+" Pemain "+(turn==="red"?"Merah":"Biru")+" MENANG! 🏆";
  }else{
    turn=turn==="red"?"blue":"red";
    message.textContent=turn==="red"?"🔴 Giliran Merah.":"🔵 Giliran Biru.";
  }
  draw();
}

reset.onclick=start;
start();
