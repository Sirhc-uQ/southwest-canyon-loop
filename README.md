# 美国西南峡谷环线

从拉斯维加斯出发，先向北到锡安国家公园，依次经过布莱斯、圆顶礁、拱门、峡谷地、纪念碑谷、羚羊峡谷、马蹄湾和大峡谷南缘，再返回拉斯维加斯。

## 地图

打开 [docs/index.html](docs/index.html) 查看交互地图、地点标记、分段车程与导航链接。也可在仓库根目录运行 `python3 -m http.server 8765 -d docs`，然后访问 `http://localhost:8765/`。

地图沿用 Oregon 项目的 Leaflet 方式。底图由 OpenStreetMap 提供，需要联网；路线轨迹由 OSRM 根据 OpenStreetMap 公路数据生成，已保存在 `docs/route-geometry.js` 中，浏览地图时无需调用路由服务。车程为常规路况下的规划粗估，不包含游览、休息、拥堵或公园内驾驶时间，出发前请以实时导航为准。

需要更新道路轨迹时，运行 `python3 scripts/fetch-routes.py`。
