# Krush : infos à demander au gérant

Tout ce qui manque pour finir le site. Chaque réponse a sa place indiquée entre crochets : il suffit de la mettre dans le fichier et de pousser sur GitHub, le site se met à jour tout seul.

## Indispensable

1. **Un numéro de téléphone**, et s'il en a un, **un portable pour WhatsApp**. Aucun numéro n'est public (ni sur Instagram ni sur Google). Avec un portable, les demandes de groupe partent directement sur WhatsApp. [`data/site.json` → `phone`, `phoneIntl`, `whatsapp` au format 33612345678]
2. **Une adresse e-mail** pour recevoir les demandes de groupe (et l'activation de Resend). [Vercel → `NOTIFY_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM` ; `data/site.json` → `email`]
3. **Le menu complet et les prix à confirmer.** Relevés sur la story « MENU » (novembre 2026), les petits prix des boissons étaient difficiles à lire : expresso 2,50 €, latte 5 €, cappuccino 5,50 €, flat white 4,50 €, matcha latte 5 €, thés 4 à 5 €, oranges pressées 6 €, citronnade 4,50 €… [`data/menu.json`]
4. **La formule à 25 €** : le détail est-il toujours celui de la story (salé au choix parmi focaccia avocado, egg muffin, Krush bénédicte, Krush dog ; sucré parmi cookie, brioche Carrément Vanille, granola, pancakes gourmands ; une boisson chaude ; une boisson fraîche) ? Y a-t-il d'autres formules (enfant, groupe) ? [`data/formules.json`]
5. **Groupes et privatisation : oui ou non**, à partir de combien de personnes, capacité maximale, créneaux possibles (le week-end ?), privatisation complète possible ? Le site les propose « sous réserve de confirmation ». [`data/site.json` → `groups`]

## Pour le contenu

6. **Le prénom du gérant et l'histoire de Krush** (ouverture le 29 mai 2022 d'après Instagram, le nom, l'idée du brunch tous les jours).
7. **La certification halal** : organisme, et veut-il l'afficher ? [`data/site.json` → `halalCertification`]
8. **Les fermetures annuelles** : août tous les ans ? Dates exactes pour 2027. [`data/horaires.json` → `closures`, qui affiche le bandeau 14 jours avant]
9. **Les moyens de paiement** acceptés (carte, espèces, titres-restaurant ?). [`data/site.json` → `paymentMethods`]
10. **Chaises hautes et poussettes** : possible ? (question de la FAQ, la réponse renvoie pour l'instant vers Instagram) [`locales/fr.json` et `en.json` → `faq`]
11. **Les plats vus sur Instagram mais absents de la carte** : Krush Habibi, gaufre Black & White, New-yorkais, lattes popcorn et barbe à papa, pancakes des tropiques. Encore servis ? [`data/menu.json`]
12. **Trois vrais avis clients** qu'il accepte de mettre en avant (par exemple repris de Google, avec le prénom). [`data/avis.json`]

## Visuels et légal

13. **Des photos et vidéos en bonne qualité**, surtout : la terrasse de jour, la salle, le jus d'orange pressé, le Mc Krush et les lattes du menu (vanille, praliné, cookie…). La liste des emplacements est dans `assets/A-PHOTOGRAPHIER.md`.
14. **Le logo en fichier d'origine** (SVG ou PDF). Il a été redessiné d'après sa photo de profil : `public/logo.svg`, à remplacer s'il a mieux.
15. **SIRET, raison sociale et nom du directeur de la publication**, pour les mentions légales. [`data/site.json` → `legal`]
16. **Nom de domaine** souhaité (par exemple krushbrunch.fr) : à brancher sur Vercel, puis relancer `npm run affichette` pour le QR code.
