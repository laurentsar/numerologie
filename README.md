# Numérologie

Thème numérologique complet, **100 % hors ligne**. PWA + APK Android (Capacitor).

Aucune donnée ne quitte le téléphone : tous les calculs sont locaux, les profils
sont stockés dans le `localStorage`. Les seuls appels réseau sont la vérification
de mise à jour (Releases GitHub) et la sauvegarde optionnelle vers Home Assistant.

## Ce que l'app calcule

**Nombres du nom** (nom complet de naissance)

| Nombre | Base |
|---|---|
| Expression | toutes les lettres |
| Intime | les voyelles |
| Réalisation | les consonnes |
| Actif | le ou les prénoms |
| Héréditaire | le nom de famille |
| Équilibre | les initiales |

**Nombres de la date** — chemin de vie, jour de naissance, année / mois / jour
personnels.

**Périodes** — 3 cycles de vie, 4 réalisations, 4 défis, avec la période en cours
mise en évidence selon l'âge.

**Grille d'inclusion** — fréquence de chaque chiffre 1 à 9 dans le nom, lacunes
et dominantes.

**Accord** — comparaison de deux profils enregistrés.

**Tirage de cartes** — tarot symbolique : 9 tirages (croix celtique modifiée,
guides spirituels, dynamique relationnelle, bilan du jour, etc.), pioche
aléatoire dans un jeu de 78 cartes (arcanes majeurs et mineurs) avec mots-clés
pour chaque carte.

## Méthode

Numérologie occidentale pythagoricienne, tradition française.

- Table : `A=1…I=9`, `J=1…R=9`, `S=1…Z=8`.
- **Chemin de vie** : jour, mois et année réduits séparément, puis additionnés et
  réduits. Cette variante préserve les nombres maîtres de chaque composante.
- **Nombres maîtres** 11, 22, 33 : conservés, jamais réduits.
- **Le Y** : voyelle sauf quand il touche une autre voyelle (`Guy` → consonne,
  `Sylvie` → voyelle).
- **Défis** : écarts absolus, sans nombre maître. `0` est une valeur à part
  entière, pas une absence de résultat.
- Les accents sont normalisés (`Éloïse` → `ELOISE`), les traits d'union et
  apostrophes traités comme des séparateurs de mots.

## Avertissement

La numérologie est une pratique symbolique, pas une science : aucune de ses
correspondances n'est établie par la recherche. L'app calcule fidèlement, elle ne
prédit rien. À prendre comme une grille de lecture, jamais comme une base de
décision médicale, financière ou juridique.

## Textes d'interprétation

Les textes livrés sont **originaux** et ne reproduisent aucun ouvrage. Ils sont
tous regroupés dans [`www/interpretations.js`](www/interpretations.js) et peuvent
être remplacés sans toucher au moteur ni à l'interface.

Chaque table accepte les clés `1` à `9`, plus `11`, `22`, `33`. Si une clé maître
manque, l'app retombe automatiquement sur le nombre réduit (11 → 2, 22 → 4,
33 → 6).

## Architecture

```
www/numerologie.js     moteur de calcul, aucune interprétation, aucune dépendance
www/interpretations.js tous les textes, remplaçables
www/tarot.js           jeu de 78 cartes + tirages (positions), remplaçable
www/app.js             interface, ne calcule rien
www/sw.js              service worker (app shell en cache, fonctionne hors ligne)
tools_gen_icon.py      génère les icônes PWA + launcher Android (pur Python)
```

## Build

L'APK est construit par GitHub Actions à chaque push sur `master` et publié en
Release. Secrets requis sur le repo : `ANDROID_KEYSTORE_B64` et
`ANDROID_KEYSTORE_PASSWORD`.

Pour bumper la version, modifier de façon cohérente :

1. `package.json` → `version`
2. `www/version.json` → `version`
3. `www/index.html` → `window.APP_VERSION`
4. `www/sw.js` → `CACHE` (sinon l'ancien cache est resservi)
5. `android/app/build.gradle` → `versionName` **et** `versionCode`
