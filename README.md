# 美国西南峡谷环线

当前计划为 **2026 年 12 月 24 日至 2027 年 1 月 2 日**：24 日晚从 LA 到拉斯维加斯，25 日前往 Moab；26 日拱门、27 日峡谷地，均从 Moab 往返；28 日转场 Kanab，29 日锡安、30 日布莱斯，均从 Kanab 往返；31 日回拉斯维加斯，1 月 2 日晚开回 LA。12 月 31 日至 1 月 2 日的具体活动及 LA、Las Vegas 的酒店地址待补充。

已确定的中途住宿：

- **Moab**：Hoodoo Moab, Curio Collection by Hilton，111 N. 100 West, Moab, UT 84532。12 月 25 日入住（4:00 PM）、28 日退房（11:00 AM）。
- **Kanab**：Holiday Inn Express & Suites Kanab by IHG，217 South 100 East, Kanab, UT 84741。12 月 28 日入住、31 日退房。

## 地图

GitHub Pages：[在线地图](https://sirhc-uq.github.io/southwest-canyon-loop/)

打开 [docs/index.html](docs/index.html) 查看交互地图、逐日计划、分段车程与导航链接。也可在仓库根目录运行 `python3 -m http.server 8765 -d docs`，然后访问 `http://localhost:8765/`。

地图沿用 Oregon 项目的 Leaflet 方式。底图由 OpenStreetMap 提供，需要联网；路线轨迹由 OSRM 根据 OpenStreetMap 公路数据生成，已保存在 `docs/route-geometry.js` 中，浏览地图时无需调用路由服务。公园日的地图道路只保存去程，返程按同一条公路计算；12 月 24 日和 1 月 2 日共用 LA–Las Vegas 公路，行驶方向相反。Moab 和 Kanab 已按酒店地址定位，LA 与 Las Vegas 暂按城市中心估算。车程为常规路况下的规划粗估，不包含游览、休息、拥堵或公园内驾驶时间。出发前请以实时导航为准。

需要更新道路轨迹时，运行 `python3 scripts/fetch-routes.py`。
