# Menyusun peta Jawa Tengah dan DIY (SVG path) dari Natural Earth admin-1 10m (domain publik).
# Pemakaian: python3 tools/make-map.py <ne_10m_admin_1_states_provinces.geojson>
import json, math, sys, os
LON0, LAT0, K = 108.45, -6.25, 300.0
COS = math.cos(math.radians(7.3))
W, H = round((111.85-LON0)*COS*K), round((-8.30-LAT0)*-K)
def proj(lon, lat): return ((lon-LON0)*COS*K, (LAT0-lat)*K)
def dp(pts, tol):
    if len(pts) < 3: return pts
    keep = [False]*len(pts); keep[0] = keep[-1] = True; st = [(0, len(pts)-1)]
    while st:
        a, b = st.pop(); ax, ay = pts[a]; bx, by = pts[b]; dx, dy = bx-ax, by-ay; L = math.hypot(dx, dy) or 1e-9
        best, bi = 0, None
        for i in range(a+1, b):
            d = abs(dy*(pts[i][0]-ax)-dx*(pts[i][1]-ay))/L
            if d > best: best, bi = d, i
        if bi is not None and best > tol: keep[bi] = True; st += [(a, bi), (bi, b)]
    return [p for p, k in zip(pts, keep) if k]
def rings(geom):
    polys = geom['coordinates'] if geom['type'] == 'MultiPolygon' else [geom['coordinates']]
    for poly in polys:
        yield poly[0]
def path(feature, tol=0.7, minarea=6):
    out = []
    for ring in rings(feature['geometry']):
        pts = [proj(*p[:2]) for p in ring]
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        if max(xs) < -60 or min(xs) > W+60 or max(ys) < -60 or min(ys) > H+60: continue
        area = abs(sum(pts[i][0]*pts[i-1][1]-pts[i-1][0]*pts[i][1] for i in range(len(pts))))/2
        if area < minarea: continue
        far = max(range(len(pts)), key=lambda i: (pts[i][0]-pts[0][0])**2+(pts[i][1]-pts[0][1])**2)
        s = dp(pts[:far+1], tol)[:-1] + dp(pts[far:], tol)  # cincin tertutup dipecah dua
        out.append('M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in s) + 'Z')
    return ''.join(out)
d = json.load(open(sys.argv[1]))
F = {f['properties']['name']: f for f in d['features'] if f['properties'].get('admin') == 'Indonesia'}
peta = {'w': W, 'h': H, 'lon0': LON0, 'lat0': LAT0, 'k': K, 'cos': round(COS, 5),
        'jateng': path(F['Jawa Tengah']), 'diy': path(F['Yogyakarta']),
        'tetangga': path(F['Jawa Barat'], 1.2) + path(F['Jawa Timur'], 1.2),
        'sumber': 'Natural Earth (domain publik), disederhanakan'}
open(os.path.join(os.path.dirname(__file__), '..', 'src', 'peta.json'), 'w').write(json.dumps(peta))
print(W, H, {k: len(v) for k, v in peta.items() if isinstance(v, str)})
