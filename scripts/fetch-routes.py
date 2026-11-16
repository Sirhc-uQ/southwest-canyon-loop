"""Refresh the static road geometry from the OSRM demo routing service.

Run only when deliberately updating the route. The deployed map uses the saved
geometry and does not contact OSRM while visitors browse it.
"""

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path


STOPS = [
    (-115.1398, 36.1699),  # Las Vegas
    (-112.9873, 37.2003),  # Zion
    (-112.1680, 37.6430),  # Bryce Canyon
    (-111.2626, 38.2916),  # Capitol Reef
    (-109.6202, 38.6166),  # Arches
    (-109.8207, 38.4580),  # Canyonlands: Island in the Sky
    (-110.1130, 36.9830),  # Monument Valley
    (-111.3744, 36.8619),  # Lower Antelope Canyon
    (-111.5021, 36.8769),  # Horseshoe Bend
    (-112.1401, 36.0544),  # Grand Canyon Village
]

VIA = [
    [(-113.5684, 37.0965)],  # St. George
    [(-112.6790, 37.2344)],  # Mt Carmel Junction
    [(-111.6000, 37.7700), (-111.4290, 37.9220)],  # Escalante, Boulder
    [(-110.7140, 38.3700), (-110.1590, 38.9950)],  # Hanksville, Green River
    [(-109.5498, 38.5733)],  # Moab
    [(-109.5498, 38.5733), (-109.4780, 37.6240)],  # Moab, Blanding
    [(-110.2546, 36.7278)],  # Kayenta
    [],  # Antelope Canyon to Horseshoe Bend directly across Page
    [(-111.4120, 35.8750), (-111.8260, 36.0380)],  # Cameron, Desert View
    [(-112.1910, 35.2490), (-114.0520, 35.1890)],  # Williams, Kingman
]


def distance_to_line(point, start, end):
    dx, dy = end[0] - start[0], end[1] - start[1]
    if dx == dy == 0:
        return ((point[0] - start[0]) ** 2 + (point[1] - start[1]) ** 2) ** 0.5
    t = max(0, min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)))
    return ((point[0] - start[0] - t * dx) ** 2 + (point[1] - start[1] - t * dy) ** 2) ** 0.5


def simplify(points, tolerance=0.0012):
    if len(points) < 3:
        return points
    first, last = points[0], points[-1]
    index, largest = max(((i, distance_to_line(p, first, last)) for i, p in enumerate(points[1:-1], 1)), key=lambda pair: pair[1])
    if largest <= tolerance:
        return [first, last]
    return simplify(points[: index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)


def main():
    routes = []
    for index, waypoints in enumerate(VIA):
        start, end = STOPS[index], STOPS[(index + 1) % len(STOPS)]
        coords = [start, *waypoints, end]
        coord_path = ";".join(f"{lon:.5f},{lat:.5f}" for lon, lat in coords)
        url = f"https://router.project-osrm.org/route/v1/driving/{coord_path}?overview=full&geometries=geojson&steps=false"
        request = urllib.request.Request(url, headers={"User-Agent": "southwest-canyon-loop/1.0 (static trip planning map)"})
        with urllib.request.urlopen(request, timeout=40) as response:
            data = json.load(response)
        if data.get("code") != "Ok" or not data.get("routes"):
            raise RuntimeError(f"Route {index + 1} failed: {data.get('code')}")
        route = data["routes"][0]
        points = simplify(route["geometry"]["coordinates"])
        routes.append({
            "points": [[round(lat, 5), round(lon, 5)] for lon, lat in points],
            "km": round(route["distance"] / 1000, 1),
            "hours": round(route["duration"] / 3600, 2),
        })
        print(f"{index + 1:02d}: {len(points)} points, {routes[-1]['km']} km, {routes[-1]['hours']} h", flush=True)
        time.sleep(1)

    output = Path(__file__).resolve().parents[1] / "docs" / "route-geometry.js"
    payload = {"source": "OSRM routing on OpenStreetMap roads", "legs": routes}
    output.write_text("window.ROUTE_GEOMETRY = " + json.dumps(payload, separators=(",", ":")) + ";\n")
    print(f"Wrote {output}")


if __name__ == "__main__":
    main()
