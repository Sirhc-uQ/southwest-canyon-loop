const stops = [
  {name:'拉斯维加斯', en:'Las Vegas', point:[36.1699,-115.1398], query:'Las Vegas, NV', type:'start', detail:'环线起点与终点。'},
  {name:'大峡谷南缘', en:'Grand Canyon South Rim', point:[36.0544,-112.1401], query:'Grand Canyon Village, AZ', detail:'按 Grand Canyon Village 一带估算。'},
  {name:'马蹄湾', en:'Horseshoe Bend', point:[36.8769,-111.5021], query:'Horseshoe Bend Trailhead, Page, AZ', detail:'Page 西南的观景点；从停车场还需步行。'},
  {name:'羚羊峡谷', en:'Antelope Canyon', point:[36.8619,-111.3744], query:'Lower Antelope Canyon, Page, AZ', detail:'按 Page 附近的入口区域估算；实际集合点以预订信息为准。'},
  {name:'纪念碑谷', en:'Monument Valley', point:[36.9830,-110.1130], query:'Monument Valley Navajo Tribal Park', detail:'纳瓦霍部落公园。'},
  {name:'峡谷地国家公园', en:'Canyonlands · Island in the Sky', point:[38.4580,-109.8207], query:'Island in the Sky Visitor Center, UT', detail:'按 Island in the Sky 游客中心估算。'},
  {name:'拱门国家公园', en:'Arches National Park', point:[38.6166,-109.6202], query:'Arches National Park Visitor Center, UT', detail:'与峡谷地可在 Moab 周边衔接。'},
  {name:'圆顶礁国家公园', en:'Capitol Reef National Park', point:[38.2916,-111.2626], query:'Capitol Reef National Park Visitor Center, UT', detail:'按 Fruita 游客中心估算。'},
  {name:'布莱斯国家公园', en:'Bryce Canyon National Park', point:[37.6430,-112.1680], query:'Bryce Canyon National Park Visitor Center, UT', detail:'从圆顶礁可经 UT-12 景观公路前往。'},
  {name:'锡安国家公园', en:'Zion National Park', point:[37.2003,-112.9873], query:'Zion Canyon Visitor Center, UT', detail:'按南入口游客中心估算。'}
];

const legs = [
  {from:0,to:1,time:'约 4.5 小时',sub:'约 278 英里 · 经 Kingman、Williams',via:['Kingman, AZ','Williams, AZ']},
  {from:1,to:2,time:'约 2.5–3 小时',sub:'经 Desert View、Cameron 前往 Page',via:['Desert View Watchtower, Grand Canyon, AZ','Cameron, AZ']},
  {from:2,to:3,time:'约 20 分钟',sub:'Page 周边短途转场',via:['Page, AZ']},
  {from:3,to:4,time:'约 2–2.5 小时',sub:'经 Kayenta 前往纪念碑谷',via:['Kayenta, AZ']},
  {from:4,to:5,time:'约 3.5–4 小时',sub:'经 Blanding、Moab；按 Island in the Sky 计算',via:['Blanding, UT','Moab, UT']},
  {from:5,to:6,time:'约 45–60 分钟',sub:'经 Moab，公园入口之间的转场',via:['Moab, UT']},
  {from:6,to:7,time:'约 2.5–3 小时',sub:'经 I-70、UT-24 前往 Fruita',via:['Green River, UT','Hanksville, UT']},
  {from:7,to:8,time:'约 2.5–3 小时',sub:'可走 UT-12；景观停车另计',via:['Boulder, UT','Escalante, UT']},
  {from:8,to:9,time:'约 2–2.5 小时',sub:'经 US-89 与 UT-9',via:['Mt Carmel Junction, UT']},
  {from:9,to:0,time:'约 2.5–3 小时',sub:'经 St. George、I-15 返回',via:['St. George, UT']}
];

function directions(leg){
  const path=[stops[leg.from].query,...leg.via,stops[leg.to].query];
  return `https://www.google.com/maps/dir/${path.map(encodeURIComponent).join('/')}/`;
}

document.querySelector('#legs').innerHTML=legs.map((leg,index)=>`
  <a class="leg" href="${directions(leg)}" target="_blank" rel="noopener" data-leg="${index}" aria-label="第 ${index+1} 段：${stops[leg.from].name} 到 ${stops[leg.to].name}，${leg.time}，打开导航">
    <span class="leg-num">${String(index+1).padStart(2,'0')}</span>
    <span class="leg-main"><strong>${stops[leg.from].name} <span aria-hidden="true">→</span> ${stops[leg.to].name}</strong><small>${leg.sub}</small></span>
    <span class="leg-time">${leg.time}</span><span class="leg-arrow" aria-hidden="true">↗</span>
  </a>`).join('');

if(typeof L!=='undefined'){
  const map=L.map('map',{scrollWheelZoom:false,zoomControl:false,preferCanvas:true});
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(map);
  const sequence=[...stops.map(s=>s.point),stops[0].point];
  L.polyline(sequence,{color:'#fff7e7',weight:8,opacity:.95,lineCap:'round',lineJoin:'round'}).addTo(map);
  L.polyline(sequence,{color:'#b95f38',weight:3.5,opacity:.95,lineCap:'round',lineJoin:'round',dashArray:'1 0'}).addTo(map);
  const markers=stops.map((stop,index)=>{
    const icon=L.divIcon({className:'pin-wrap',html:`<span class="pin ${index===0?'pin-start':''}">${index===0?'◈':String(index).padStart(2,'0')}</span>`,iconSize:[34,34],iconAnchor:[17,17]});
    return L.marker(stop.point,{icon,title:stop.name}).addTo(map).bindPopup(`<div class="stop-popup"><small>${index===0?'START / FINISH':`STOP ${String(index).padStart(2,'0')}`}</small><strong>${stop.name}</strong><span>${stop.en}</span><p>${stop.detail}</p></div>`);
  });
  legs.forEach((leg,index)=>{
    const a=stops[leg.from].point,b=stops[leg.to].point;
    const t=index===2?.52:.5;
    const midpoint=[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    L.marker(midpoint,{interactive:false,icon:L.divIcon({className:'time-wrap',html:`<span class="time-label">${leg.time.replace('约 ','')}</span>`})}).addTo(map);
  });
  map.fitBounds(L.latLngBounds(stops.map(s=>s.point)),{padding:[76,76]});
  document.querySelectorAll('.leg').forEach(card=>{
    card.addEventListener('mouseenter',()=>{const leg=legs[Number(card.dataset.leg)];markers[leg.to].openPopup();});
    card.addEventListener('focus',()=>{const leg=legs[Number(card.dataset.leg)];markers[leg.to].openPopup();});
  });
}else{
  document.querySelector('#map').innerHTML='<p class="map-error">地图脚本未加载。下方分段导航链接仍可使用。</p>';
}
