# [Nom de l'Extension]

Une extension Chrome simple pour sauvegarder et injecter rapidement vos prompts favoris.

## Installation (Mode Développeur)

Cette extension n'est pas encore publiée sur le Chrome Web Store. Pour l'utiliser, vous devez la charger manuellement dans votre navigateur (Chrome ou basé sur Chromium comme Edge) en suivant ces étapes :

1.  **Téléchargez/Obtenez le code :** Assurez-vous d'avoir le dossier complet de l'extension (celui qui contient `manifest.json`, `popup.html`, etc.) sur votre ordinateur.
2.  **Ouvrez Chrome**.
3.  **Allez à la page des extensions :** Tapez `chrome://extensions` (ou `edge://extensions` pour Edge) dans la barre d'adresse et appuyez sur Entrée.
4.  **Activez le Mode Développeur :** Cherchez un interrupteur intitulé "Mode développeur" (Developer mode) en haut à droite de la page et activez-le.
5.  **Chargez l'extension :** Des boutons devraient apparaître. Cliquez sur **"Charger l'extension non empaquetée"** (Load unpacked).
6.  **Sélectionnez le dossier :** Une fenêtre de sélection de dossier s'ouvre. Naviguez jusqu'au dossier de l'extension (celui qui contient `manifest.json`) et sélectionnez **le dossier entier**. Cliquez sur "Sélectionner un dossier".
7.  **Vérification :** L'extension "[Nom de l'Extension]" devrait maintenant apparaître dans la liste sur la page `chrome://extensions/`, et son icône (votre logo R !) devrait être visible dans la barre d'outils de votre navigateur (parfois cachée derrière l'icône "puzzle" des extensions).

**Note:** Si vous modifiez le code de l'extension, vous devrez retourner sur la page `chrome://extensions/` et cliquer sur le bouton d'actualisation (flèche circulaire) sur la carte de votre extension pour que les changements prennent effet.

## Utilisation

### Injecter un Prompt Sauvegardé

1.  Naviguez vers une page web contenant un champ de texte (zone de commentaire, formulaire, éditeur, etc.).
2.  **ÉTAPE CRUCIALE : Cliquez avec votre souris *à l'intérieur* du champ de texte où vous souhaitez insérer le prompt.** Cela donne le "focus" à ce champ.
3.  Cliquez sur l'icône de l'extension **[Nom de l'Extension]** dans votre barre d'outils Chrome pour ouvrir la pop-up.
4.  Dans la liste qui apparaît, cliquez sur le nom du prompt que vous voulez utiliser.
5.  Le texte du prompt devrait être injecté dans le champ où vous aviez cliqué, et la pop-up se fermera automatiquement.

### Ajouter un Nouveau Prompt

1.  Cliquez sur l'icône de l'extension **[Nom de l'Extension]** dans votre barre d'outils.
2.  Dans la section du bas ("Ou entrez un prompt rapide"), remplissez :
    * Le champ **"Titre"** (donnez un nom reconnaissable à votre prompt).
    * La zone **"Texte du prompt"** (entrez le contenu complet du prompt).
3.  Cliquez sur le bouton **"Ajouter"**.
4.  Une petite alerte confirmera l'ajout, et le nouveau prompt apparaîtra dans la liste en haut de la pop-up (la liste se rafraîchit).

### Supprimer un Prompt

1.  Cliquez sur l'icône de l'extension **[Nom de l'Extension]**.
2.  Repérez le prompt que vous voulez supprimer dans la liste.
3.  Cliquez sur l'icône **poubelle (🗑️)** à droite du nom de ce prompt.
4.  Une boîte de dialogue vous demandera de confirmer la suppression. Cliquez sur "OK".
5.  Le prompt disparaîtra de la liste.

## Notes

* Les prompts sont sauvegardés **localement** sur votre machine via `chrome.storage.local`. Ils ne sont pas synchronisés entre différents ordinateurs.
* L'injection de texte peut ne pas fonctionner parfaitement sur certains sites web très complexes qui utilisent des techniques avancées pour gérer leurs champs de saisie (comme la recherche Google, par exemple).

---
![Capture d'écran de la popup de l'extension](https://postimg.cc/1nD5cPFK)