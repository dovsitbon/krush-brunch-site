# Photos à prendre sur place

Les photos du site viennent de son Instagram (`raw/`, triées dans les dossiers ci-dessous). Quelques emplacements attendent encore une vraie photo : déposez le fichier sous le nom indiqué, puis lancez `npm run media`. Tant qu'une photo manque, un œuf dessiné au trait tient la place (aucune fausse photo).

Conseils : lumière du jour, assiettes vues de dessus ou à 45°, pas de visages de clients, format vertical ou carré, au moins 1600 px de large.

| Fichier à déposer | Où il apparaît | Ce qu'on veut voir |
|---|---|---|
| `salle-terrasse/terrasse.jpg` | bloc « Une table au soleil » (remplace la façade) | la terrasse de jour, tables dressées |
| `salle-terrasse/salle.jpg` | pages Paris 15 / halal | la salle avec le néon, sans clients |
| `sale/mc-krush.jpg` | menu, Mc Krush (aucune photo pour l'instant) | le burger vu de face |
| `boissons/oranges-pressees.jpg` | menu, boissons | le jus d'orange pressé (cité dans les avis) |
| `boissons/latte-vanille.jpg`, `latte-praline.jpg`, `latte-cookie.jpg` | menu, nos spéciales | chaque latte du menu |
| `sucre/cookie.jpg` | tuile « Cookies & douceurs » et menu | le cookie praliné actuel avec sa crème anglaise (la photo actuelle est l'ancien maxi cookie) |

Pour qu'une nouvelle photo apparaisse dans le menu, ajoutez aussi son chemin dans `data/menu.json` (champ `photo`, par ex. `/media/sale/mc-krush.jpg`).

## Dossiers

- `hero/` : la table vue de dessus (hero, image de partage, affichette) et la table de la formule
- `sale/`, `sucre/`, `boissons/` : une photo par plat (nom de fichier = identifiant du plat)
- `salle-terrasse/` : façade, néon, salle, terrasse
- `galerie/` : les 9 photos de la galerie Instagram (ordre = nom de fichier)
- `raw/` : les 156 visuels d'origine d'Instagram et la story « MENU » (non versionnés)
