"""Refresh the static road geometry from the OSRM demo routing service.

Run only when deliberately updating the route. The deployed map uses the saved
geometry and does not contact OSRM while visitors browse it.
"""

import json
import time
import urllib.request
from pathlib import Path


STOPS = {
    "las_vegas": (-115.1398, 36.1699),
    "moab": (-109.55381, 38.57468),  # Hoodoo Moab, 111 N 100 West
    "arches": (-109.6202, 38.6166),
    "canyonlands": (-109.8207, 38.4580),
    "kanab": (-112.52584, 37.04426),  # Holiday Inn Express, 217 S 100 East
    "zion": (-112.9873, 37.2003),
    "bryce": (-112.1680, 37.6430),
    "los_angeles": (-118.2437, 34.0522),
}

# One geometry for each transfer or day trip; day trips return on the same road.
ROUTES = [
    ("las_vegas", "moab"),
    ("moab", "arches"),
    ("moab", "canyonlands"),
    ("moab", "kanab"),
    ("kanab", "zion"),
    ("kanab", "bryce"),
    ("kanab", "las_vegas"),
    ("las_vegas", "los_angeles"),
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
    for index, (start_id, end_id) in enumerate(ROUTES):
        coords = [STOPS[start_id], STOPS[end_id]]
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
            "from": start_id,
            "to": end_id,
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
