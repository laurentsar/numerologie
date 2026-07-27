#!/usr/bin/env python3
"""Génère toutes les icônes (PWA + launcher Android) sans dépendance externe.

Motif : un cercle doré ceint de 9 points, sur fond violet sombre.
Encodeur PNG pur-Python (zlib seulement).

Produit :
  www/img/icon-192.png, icon-512.png                       (PWA)
  android/.../mipmap-*/ic_launcher.png                     (coins arrondis)
  android/.../mipmap-*/ic_launcher_round.png               (rond)
  android/.../mipmap-*/ic_launcher_foreground.png          (fond transparent)
"""
import struct, zlib, math, os

BG = (18, 10, 31)        # #120a1f
OR1 = (224, 178, 60)     # #e0b23c
OR2 = (246, 224, 150)    # doré clair (dégradé vertical)

# Tailles Android : (dossier mipmap, taille launcher, taille foreground)
MIPMAPS = [
    ('mdpi', 48, 108),
    ('hdpi', 72, 162),
    ('xhdpi', 96, 216),
    ('xxhdpi', 144, 324),
    ('xxxhdpi', 192, 432),
]


def _degrade(y, s):
    f = y / s
    return tuple(int(OR1[i] + (OR2[i] - OR1[i]) * f) for i in range(3))


def make(size, forme='arrondi', echelle=1.0):
    """forme : 'arrondi' | 'rond' | 'transparent'.
    echelle : réduit le motif (zone de sécurité des icônes adaptatives)."""
    s = size
    cx = cy = s / 2.0
    k = echelle
    r_ring = s * 0.30 * k
    ep = max(1.0, s * 0.045 * k)
    r_pt = max(0.8, s * 0.048 * k)
    r_orbite = s * 0.405 * k
    rad_coin = s * 0.22

    pts = []
    for i in range(9):
        a = -math.pi / 2 + i * 2 * math.pi / 9
        pts.append((cx + r_orbite * math.cos(a), cy + r_orbite * math.sin(a)))

    px = bytearray()
    for y in range(s):
        px.append(0)  # type de filtre
        for x in range(s):
            fx, fy = x + 0.5, y + 0.5

            # --- découpe de la forme extérieure
            if forme == 'rond':
                if math.hypot(fx - cx, fy - cy) > s / 2.0:
                    px += bytes((0, 0, 0, 0)); continue
            elif forme == 'arrondi':
                qx = min(max(x, rad_coin), s - rad_coin)
                qy = min(max(y, rad_coin), s - rad_coin)
                if math.hypot(x - qx, y - qy) > rad_coin:
                    px += bytes((0, 0, 0, 0)); continue

            # --- motif
            trace = abs(math.hypot(fx - cx, fy - cy) - r_ring) <= ep / 2
            if not trace:
                for (a, b) in pts:
                    if math.hypot(fx - a, fy - b) <= r_pt:
                        trace = True; break

            if trace:
                c = _degrade(y, s)
                px += bytes((c[0], c[1], c[2], 255))
            elif forme == 'transparent':
                px += bytes((0, 0, 0, 0))
            else:
                px += bytes((BG[0], BG[1], BG[2], 255))
    return bytes(px)


def png(path, size, forme='arrondi', echelle=1.0):
    raw = make(size, forme, echelle)

    def chunk(typ, data):
        c = typ + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)  # RGBA
    out = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) \
        + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(out)
    print('  %-72s %dx%d' % (os.path.relpath(path, RACINE), size, size))


RACINE = os.path.dirname(os.path.abspath(__file__))

if __name__ == '__main__':
    print('PWA :')
    img = os.path.join(RACINE, 'www', 'img')
    png(os.path.join(img, 'icon-192.png'), 192)
    png(os.path.join(img, 'icon-512.png'), 512)

    print('Launcher Android :')
    res = os.path.join(RACINE, 'android', 'app', 'src', 'main', 'res')
    for dossier, taille, taille_fg in MIPMAPS:
        d = os.path.join(res, 'mipmap-' + dossier)
        png(os.path.join(d, 'ic_launcher.png'), taille, 'arrondi')
        png(os.path.join(d, 'ic_launcher_round.png'), taille, 'rond')
        # icône adaptative : motif réduit à 62 % pour tenir dans la zone sûre
        png(os.path.join(d, 'ic_launcher_foreground.png'), taille_fg, 'transparent', 0.62)
