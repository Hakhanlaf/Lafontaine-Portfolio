# Portfolio — communication & graphisme

Site statique en français, sans installation ni compilation. Les barres bleues et orange structurent son identité visuelle. Les couleurs sont des valeurs provisoires, faute de référence de DA fournie : `--blue` et `--orange` au début de `styles.css` permettent de reprendre les teintes exactes.

## Ouvrir le site

Double-cliquez sur `index.html`. Tous les chemins sont relatifs : le site fonctionne aussi dans un dépôt GitHub Pages nommé `portfolio`. Aucun service tiers, police distante, outil de suivi ou formulaire serveur n’est utilisé.

## Personnaliser les contenus

Ouvrez `content.js` dans un éditeur de texte. Conservez les guillemets, virgules et crochets. Les textes ne doivent contenir que des informations vérifiées.

- `name` : prénom et nom. Vide, le site affiche « Portfolio ». Le nom figurant dans un ancien brouillon de candidature n’a pas été considéré comme une identité confirmée.
- `email` : adresse réelle ; le lien de contact apparaît automatiquement.
- `linkedin` : URL HTTPS du profil ; le lien apparaît lorsqu’elle est renseignée.
- `cv` : ajoutez votre PDF dans `assets/`, puis indiquez `assets/cv.pdf`.
- `about` : présentation exacte du parcours, des expériences et des compétences. Aucune formation précise ni maîtrise de logiciel n’a été supposée.
- `projects` : remplacez les introductions de préparation par les descriptions réelles. Vous pouvez copier un objet pour ajouter un projet, ou en retirer un. Gardez la catégorie `edition`, `graphisme`, `video` ou `jeu` pour les filtres.

Pour chaque projet :

| Champ | Contenu attendu |
| --- | --- |
| `title` / `intro` | Titre réel et résumé court |
| `image` | Chemin d’un visuel, par exemple `assets/livret-couverture.webp` |
| `alt` | Description utile du visuel pour une personne qui ne le voit pas |
| `context` | Commande, public, objectif, date si connue |
| `role` | Contribution personnelle ; distinguer les autres membres d’une équipe |
| `approach` | Choix éditoriaux, graphiques ou audiovisuels et leurs raisons |
| `tools` | Logiciels effectivement utilisés |
| `result` | Livrables ou résultats attestés, sans métrique inventée |
| `link` / `linkLabel` | PDF local ou lien HTTPS vers une vidéo, un jeu ou une galerie |

Les coordonnées et liens vides sont masqués. Les images et fiches absentes portent une mention explicite. La note de préparation disparaît lorsque chaque projet possède une image et au moins un champ de fiche ; vérifiez cependant vous-même que toutes les descriptions sont finalisées. Pour retirer une rubrique encore vide, supprimez son objet du tableau `projects`.

Pour les vidéos : ajoutez une vignette et un lien HTTPS vers la vidéo hébergée. Pour le livret : une couverture et un PDF dont les informations confidentielles ont été retirées. Pour les jeux : captures réelles, rôle précis et lien vers une page de jeu ou une démonstration existante. Aucun visuel de projet factice n’est inclus.

Préférez des images WebP ou JPEG d’environ 1 600 pixels de large et de moins de 500 Ko. Les vignettes sont recadrées ; ajustez `object-fit: cover` en `contain` dans `styles.css` pour montrer une page entière. Utilisez des noms de fichiers simples, en minuscules et sans espaces. Respectez exactement leur casse.

## Publier gratuitement sur GitHub Pages

Procédure vérifiée dans la documentation GitHub le 28 octobre 2026. Un dépôt public est nécessaire avec GitHub Free.

1. Connectez-vous à GitHub et créez un dépôt **public** nommé `portfolio`. Pour une adresse à la racine, nommez-le plutôt `VOTRE-PSEUDO.github.io`, avec votre véritable identifiant GitHub.
2. Dans le dépôt, choisissez **Add file → Upload files**. Importez le contenu du dossier `portfolio`, et non le dossier parent : `index.html` doit apparaître à la racine du dépôt, aux côtés de `styles.css`, `content.js`, `script.js` et du dossier `assets`.
3. Validez avec **Commit changes**. Ajoutez également le fichier vide `.nojekyll` s’il n’a pas été importé ; il peut être créé via **Add file → Create new file**.
4. Dans **Settings → Pages → Build and deployment**, choisissez **Deploy from a branch**, puis **main**, le dossier **/(root)** et **Save**.
5. Attendez la fin de la publication. Retrouvez l’adresse exacte dans **Settings → Pages**. Pour un dépôt `portfolio`, elle sera de la forme `https://VOTRE-PSEUDO.github.io/portfolio/`. Pour le dépôt `VOTRE-PSEUDO.github.io`, elle sera `https://VOTRE-PSEUDO.github.io/`.
6. Ouvrez cette adresse sur ordinateur et téléphone, testez chaque lien et le téléchargement du CV. Les modifications futures se publient en mettant à jour les fichiers de la branche `main`.

Aucune carte bancaire ni domaine payant n’est nécessaire pour cette configuration. Le site n’a pas été publié et aucun dépôt n’a été créé à votre place.

Sources officielles : [Guide de démarrage](https://docs.github.com/en/pages/quickstart) et [configuration de la source de publication](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Avant d’envoyer le lien aux recruteurs

- Renseigner identité, coordonnées, présentation et CV.
- Intégrer les créations réelles et remplacer les textes de préparation.
- Vérifier les droits de diffusion et anonymiser les documents internes.
- Adapter le titre et la description dans `index.html` si nécessaire.
- Vérifier les filtres, les fiches, les liens, le clavier et l’affichage mobile.

Si GitHub affiche une erreur 404, vérifiez que `index.html` est bien à la racine de la source choisie et que le déploiement est terminé dans l’onglet **Actions**. Si un média manque, vérifiez son chemin et la casse du nom. GitHub Pages ne traite pas de formulaire de contact : le contact utilise votre messagerie avec un lien `mailto:`.
