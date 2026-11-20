const hotels = {
  moab:{name:'Hoodoo Moab, Curio Collection by Hilton',address:'111 N. 100 West, Moab, UT 84532',phone:'+1 435-355-0595',checkIn:'12/25 · 4:00 PM',checkOut:'12/28 · 11:00 AM'},
  kanab:{name:'Holiday Inn Express & Suites Kanab by IHG',address:'217 South 100 East, Kanab, UT 84741',checkIn:'12/28',checkOut:'12/31'}
};

const places = {
  los_angeles: {name:'洛杉矶', en:'Los Angeles', point:[34.0522,-118.2437], query:'Los Angeles, CA', dates:'12/24 出发 · 1/2 返回', detail:'具体出发地点与返程落脚地址待补充。'},
  las_vegas: {name:'拉斯维加斯', en:'Las Vegas', point:[36.1699,-115.1398], query:'Las Vegas, NV', dates:'12/24–25 · 12/31–1/2', detail:'两次停留；酒店地址待补充。'},
  moab: {name:'Moab', en:'Moab, Utah', point:[38.57468,-109.55381], query:'Hoodoo Moab, 111 N 100 West, Moab, UT 84532', dates:'12/25–28', hotel:'moab'},
  arches: {name:'拱门国家公园', en:'Arches National Park', point:[38.6166,-109.6202], query:'Arches National Park Visitor Center, UT', dates:'12/26', detail:'当天从 Moab 往返；地图按游客中心定位。'},
  canyonlands: {name:'峡谷地国家公园', en:'Canyonlands · Island in the Sky', point:[38.4580,-109.8207], query:'Island in the Sky Visitor Center, UT', dates:'12/27', detail:'当天从 Moab 往返；按 Island in the Sky 游客中心定位。'},
  kanab: {name:'Kanab', en:'Kanab, Utah', point:[37.04426,-112.52584], query:'Holiday Inn Express & Suites Kanab, 217 South 100 East, Kanab, UT 84741', dates:'12/28–31', hotel:'kanab'},
  zion: {name:'锡安国家公园', en:'Zion National Park', point:[37.2003,-112.9873], query:'Zion Canyon Visitor Center, UT', dates:'12/29', detail:'当天从 Kanab 往返；按南入口游客中心定位。'},
  bryce: {name:'布莱斯国家公园', en:'Bryce Canyon National Park', point:[37.6430,-112.1680], query:'Bryce Canyon National Park Visitor Center, UT', dates:'12/30', detail:'当天从 Kanab 往返；按游客中心定位。'}
};

const driveDays = [
  {date:'12/24',from:'los_angeles',to:'las_vegas',time:'约 5–5.5 小时',sub:'晚上从 LA 出发；实际起点和时间待补充'},
  {date:'12/25',from:'las_vegas',to:'moab',time:'约 7.5–8.5 小时',sub:'长途转场；未含休息与沿途停靠'},
  {date:'12/26',from:'moab',to:'arches',roundtrip:true,time:'往返约 25–45 分钟',sub:'Moab ↔ 拱门游客中心；园内驾驶另计'},
  {date:'12/27',from:'moab',to:'canyonlands',roundtrip:true,time:'往返约 1.75–2.25 小时',sub:'Moab ↔ Island in the Sky 游客中心'},
  {date:'12/28',from:'moab',to:'kanab',time:'约 5.75–6.5 小时',sub:'Moab 转场到 Kanab；未安排中途景点'},
  {date:'12/29',from:'kanab',to:'zion',roundtrip:true,time:'往返约 2.25–2.75 小时',sub:'Kanab ↔ 锡安南入口；园内交通另计'},
  {date:'12/30',from:'kanab',to:'bryce',roundtrip:true,time:'往返约 3.25–3.75 小时',sub:'Kanab ↔ 布莱斯游客中心；园内驾驶另计'},
  {date:'12/31',from:'kanab',to:'las_vegas',time:'约 3.75–4.5 小时',sub:'返回拉斯维加斯；当天具体活动待更新'},
  {date:'1/2',from:'las_vegas',to:'los_angeles',time:'约 5–5.5 小时',sub:'晚上前往 LA；白天活动与目的地址待更新'}
];

const days = [
  {date:'12/24',title:'洛杉矶 → 拉斯维加斯',description:'晚上从 LA 开车到 Las Vegas。出发时刻与具体地址待补充。',stay:'Las Vegas',drive:0},
  {date:'12/25',title:'拉斯维加斯 → Moab',description:'前往 Moab；Hoodoo Moab 入住时间为 4:00 PM。',stay:'Moab',drive:1},
  {date:'12/26',title:'拱门国家公园',description:'从 Moab 往返拱门国家公园，当晚继续住 Moab。',stay:'Moab',drive:2},
  {date:'12/27',title:'峡谷地国家公园',description:'从 Moab 往返峡谷地国家公园；地图按 Island in the Sky 区域标记。',stay:'Moab',drive:3},
  {date:'12/28',title:'Moab → Kanab',description:'Hoodoo Moab 11:00 AM 退房；转场到 Kanab，入住 Holiday Inn Express & Suites。',stay:'Kanab',drive:4},
  {date:'12/29',title:'锡安国家公园',description:'从 Kanab 往返锡安国家公园，当晚继续住 Kanab。',stay:'Kanab',drive:5},
  {date:'12/30',title:'布莱斯国家公园',description:'从 Kanab 往返布莱斯国家公园，当晚继续住 Kanab。',stay:'Kanab',drive:6},
  {date:'12/31',title:'Kanab → 拉斯维加斯',description:'Kanab 酒店退房后返回 Las Vegas；当天的具体活动稍后补充。',stay:'Las Vegas',drive:7,pending:true},
  {date:'1/1',title:'拉斯维加斯',description:'当天的具体活动稍后补充。',stay:'Las Vegas',pending:true},
  {date:'1/2',title:'拉斯维加斯 → 洛杉矶',description:'白天活动稍后补充；晚上开车前往 LA。',stay:'LA',drive:8,pending:true}
];

function directions(drive){
  const path=[places[drive.from].query,places[drive.to].query];
  if(drive.roundtrip)path.push(places[drive.from].query);
  return `https://www.google.com/maps/dir/${path.map(encodeURIComponent).join('/')}/`;
}
function driveTitle(drive){
  return `${places[drive.from].name} ${drive.roundtrip?'↔':'→'} ${places[drive.to].name}`;
}
function roadMidpoint(points){
  const lengths=points.slice(1).map((point,index)=>{
    const previous=points[index];
    const latitude=(point[0]+previous[0])*Math.PI/360;
    return Math.hypot((point[0]-previous[0])*111,(point[1]-previous[1])*111*Math.cos(latitude));
  });
  let remaining=lengths.reduce((total,length)=>total+length,0)/2;
  for(let index=0;index<lengths.length;index++){
    if(remaining<=lengths[index]){
      const fraction=remaining/lengths[index];
      return points[index].map((value,axis)=>value+(points[index+1][axis]-value)*fraction);
    }
    remaining-=lengths[index];
  }
  return points[Math.floor(points.length/2)];
}

const legsNode=document.querySelector('#legs');
legsNode.innerHTML=driveDays.map((drive,index)=>`
  <a class="leg" href="${directions(drive)}" target="_blank" rel="noopener" data-leg="${index}" aria-label="${drive.date}：${driveTitle(drive)}，${drive.time}，打开导航">
    <span class="leg-num">${drive.date}</span>
    <span class="leg-main"><strong>${driveTitle(drive)}</strong><small>${drive.sub}</small></span>
    <span class="leg-time">${drive.time}</span><span class="leg-arrow" aria-hidden="true">↗</span>
  </a>`).join('');

document.querySelector('#timeline').innerHTML=days.map(day=>{
  const drive=day.drive===undefined?null:driveDays[day.drive];
  const hotel=hotels[day.stay.toLowerCase()];
  const lodging=hotel?`<div class="day-hotel"><strong>住宿 · ${hotel.name}</strong><span>${hotel.address}</span></div>`:`<div class="day-tags"><span>住宿：${day.stay}</span><span>酒店地址待补充</span></div>`;
  return `<article class="day-card${day.pending?' pending':''}">
    <div class="day-date"><strong>${day.date}</strong><span>${day.pending?'活动待更新':'已确定路线'}</span></div>
    <div class="day-copy"><h3>${day.title}</h3><p>${day.description}</p>${lodging}</div>
    <div class="day-drive">${drive?`<strong>${drive.time}</strong><a href="${directions(drive)}" target="_blank" rel="noopener">查看导航 ↗</a>`:'<strong>当地活动待更新</strong>'}</div>
  </article>`;
}).join('');

if(typeof L!=='undefined'){
  const map=L.map('map',{scrollWheelZoom:false,zoomControl:false,preferCanvas:true});
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(map);
  const roadLegs=window.ROUTE_GEOMETRY?.legs;
  const expected=['las_vegas:moab','moab:arches','moab:canyonlands','moab:kanab','kanab:zion','kanab:bryce','kanab:las_vegas','las_vegas:los_angeles'];
  const hasRoads=roadLegs?.length===expected.length&&roadLegs.every((road,index)=>`${road.from}:${road.to}`===expected[index]);
  if(hasRoads){
    roadLegs.forEach((road,index)=>{
      const daytrip=[1,2,4,5].includes(index);
      const color=index===7?'#20383b':daytrip?'#438589':'#b95f38';
      L.polyline(road.points,{color:'#fffdf7',weight:9,opacity:.9,lineCap:'round',lineJoin:'round'}).addTo(map);
      const line=L.polyline(road.points,{color,weight:4,opacity:.96,lineCap:'round',lineJoin:'round'}).addTo(map);
      const drive=driveDays.find(item=>(item.from===road.from&&item.to===road.to)||(item.from===road.to&&item.to===road.from));
      const date=index===7?'12/24、1/2':drive.date;
      const title=index===7?'洛杉矶 ↔ 拉斯维加斯':driveTitle(drive);
      line.bindPopup(`<b>${date} · ${title}</b><br>${drive.time}<br><small>基础车程，不含活动与停靠</small>`);
      if(!daytrip){
        const midpoint=roadMidpoint(road.points);
        L.marker(midpoint,{interactive:false,icon:L.divIcon({className:'time-wrap',html:`<span class="time-label">${date} · ${drive.time.replace('约 ','')}</span>`})}).addTo(map);
      }
    });
  }else{
    document.querySelector('#map-status').hidden=false;
  }
  const order=['los_angeles','las_vegas','moab','arches','canyonlands','kanab','zion','bryce'];
  const markers={};
  order.forEach((id,index)=>{
    const place=places[id];
    const kind=['los_angeles','las_vegas'].includes(id)?'pin-start':['moab','kanab'].includes(id)?'pin-base':'pin-park';
    const shifted=id==='arches'?'pin-shift-right':'';
    const icon=L.divIcon({className:'pin-wrap',html:`<span class="pin ${kind} ${shifted}">${String(index+1).padStart(2,'0')}</span>`,iconSize:[34,34],iconAnchor:[17,17]});
    const hotel=place.hotel?hotels[place.hotel]:null;
    const detail=hotel?`<p><b>${hotel.name}</b><br>${hotel.address}${hotel.phone?`<br>${hotel.phone}`:''}</p><p>入住 ${hotel.checkIn}<br>退房 ${hotel.checkOut}</p>`:`<p>${place.detail}</p>`;
    markers[id]=L.marker(place.point,{icon,title:place.name}).addTo(map).bindPopup(`<div class="stop-popup"><small>${place.dates}</small><strong>${place.name}</strong><span>${place.en}</span>${detail}</div>`);
  });
  const mapNameLayer=L.DomUtil.create('div','map-name-layer',map.getPanes().tooltipPane);
  mapNameLayer.setAttribute('aria-hidden','true');
  let mapNameFrame=0;
  function renderMapNames(){
    mapNameLayer.replaceChildren();
    const {x:width,y:height}=map.getSize();
    mapNameLayer.style.width=`${width}px`;
    mapNameLayer.style.height=`${height}px`;
    const mapRect=map.getContainer().getBoundingClientRect();
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','map-name-lines');
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    mapNameLayer.append(svg);
    const placed=[];
    const keyRect=document.querySelector('.map-key').getBoundingClientRect();
    placed.push({x:keyRect.left-mapRect.left-8,y:keyRect.top-mapRect.top-8,w:keyRect.width+16,h:keyRect.height+16});
    document.querySelectorAll('#map .time-label').forEach(node=>{
      const rect=node.getBoundingClientRect();
      placed.push({x:rect.left-mapRect.left-4,y:rect.top-mapRect.top-4,w:rect.width+8,h:rect.height+8});
    });
    const locations=order.map(id=>{
      const pin=markers[id].getElement()?.querySelector('.pin');
      const rect=pin?.getBoundingClientRect();
      if(!rect)return null;
      return {id,x:rect.left+rect.width/2-mapRect.left,y:rect.top+rect.height/2-mapRect.top,rect};
    }).filter(Boolean);
    locations.forEach(({rect})=>placed.push({x:rect.left-mapRect.left-3,y:rect.top-mapRect.top-3,w:rect.width+6,h:rect.height+6}));
    const overlaps=(a,b)=>a.x<b.x+b.w+4&&a.x+a.w+4>b.x&&a.y<b.y+b.h+3&&a.y+a.h+3>b.y;
    locations.filter(({x,y})=>x>=0&&x<=width&&y>=0&&y<=height).sort((a,b)=>a.y-b.y).forEach(({id,x,y})=>{
      const label=document.createElement('span');
      label.className='map-name-label';
      label.textContent=places[id].en;
      mapNameLayer.append(label);
      const w=label.offsetWidth,h=label.offsetHeight;
      const shifts=[0];
      for(let delta=26;delta<height;delta+=26)shifts.push(-delta,delta);
      let choice;
      for(const shift of shifts){
        const sides=x>width/2?['left','right']:['right','left'];
        for(const side of sides){
          const rawX=side==='right'?x+24:x-24-w;
          const box={x:Math.max(5,Math.min(width-w-5,rawX)),y:Math.max(5,Math.min(height-h-5,y-h/2+shift)),w,h,side};
          if(!placed.some(other=>overlaps(box,other))){choice=box;break;}
        }
        if(choice)break;
      }
      if(!choice){
        choice={x:Math.max(5,Math.min(width-w-5,x+24)),y:Math.max(5,Math.min(height-h-5,y-h/2)),w,h,side:'right'};
        label.classList.add('is-crowded');
      }
      const labelPoint=map.containerPointToLayerPoint([choice.x,choice.y]);
      label.style.left=`${labelPoint.x}px`;
      label.style.top=`${labelPoint.y}px`;
      placed.push(choice);
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      const start=map.containerPointToLayerPoint([x,y]);
      const end=map.containerPointToLayerPoint([choice.side==='right'?choice.x:choice.x+w,choice.y+h/2]);
      line.setAttribute('x1',start.x);line.setAttribute('y1',start.y);
      line.setAttribute('x2',end.x);line.setAttribute('y2',end.y);
      svg.append(line);
    });
  }
  function scheduleMapNames(){
    if(mapNameFrame)return;
    mapNameFrame=requestAnimationFrame(()=>{
      mapNameFrame=0;
      renderMapNames();
    });
  }
  map.on('move moveend zoom zoomend resize',scheduleMapNames);
  const bounds=hasRoads?roadLegs.flatMap(road=>road.points):Object.values(places).map(place=>place.point);
  map.fitBounds(L.latLngBounds(bounds),{padding:[70,70]});
  scheduleMapNames();
  document.querySelectorAll('.leg').forEach(card=>{
    for(const event of ['mouseenter','focus'])card.addEventListener(event,()=>{
      const drive=driveDays[Number(card.dataset.leg)];
      markers[drive.to].openPopup();
    });
  });
}else{
  document.querySelector('#map').innerHTML='<p class="map-error">地图脚本未加载。下方分段导航链接仍可使用。</p>';
}
