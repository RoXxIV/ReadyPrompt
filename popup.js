document.addEventListener('DOMContentLoaded', () => {
    console.log("popup.HTML est prêt. Lancement du script.");
    loadAndDisplayPrompts();// Chargement et affichage des prompts

    // gere l'ajout d'un prompt sauvegardé
    console.log("Initialisation section prompt.");
    const customTitleInput = document.getElementById('custom-title');
    const customPromptTextarea = document.getElementById('custom-prompt');
    const addCustomBtn = document.getElementById('add-custom-prompt');

    // check si les éléments section perso sont trouvés
    if (customTitleInput && customPromptTextarea && addCustomBtn) {
        console.log("Éléments section perso trouvés. Ajout écouteur 'Ajouter'.");
        addCustomBtn.addEventListener('click', () => {
            const title = customTitleInput.value.trim();
            const text = customPromptTextarea.value.trim();
            // check si les champs sont remplis
            if (title && text) {
                console.log("Ajout du prompt personnalisé demandé.");
                const newPrompt = { name: title, text: text };
                // Définit le nom de la 'clé' sous laquelle on sauvegarde notre liste dans le stockage Chrome
                const storageKey = 'promptListData';
                chrome.storage.local.get([storageKey], (result) => {
                    if (chrome.runtime.lastError) { console.error("Erreur lecture stockage avant ajout : ", chrome.runtime.lastError); alert("Erreur lecture stockage."); return; }
                    let prompts = result[storageKey] || [];
                    if (prompts.some(p => p.name.toLowerCase() === title.toLowerCase())) {
                         if (!confirm(`Un prompt nommé "${title}" existe déjà. Voulez-vous l'écraser ?`)) { customTitleInput.focus(); return; }
                         prompts = prompts.filter(p => p.name.toLowerCase() !== title.toLowerCase());
                     }
                    prompts.push(newPrompt);
                    chrome.storage.local.set({ [storageKey]: prompts }, () => {
                        if (chrome.runtime.lastError) { console.error("Erreur sauvegarde stockage après ajout : ", chrome.runtime.lastError); alert("Erreur sauvegarde."); }
                        else {
                            console.log("Nouveau prompt ajouté :", newPrompt);
                            customTitleInput.value = ''; customPromptTextarea.value = '';
                            loadAndDisplayPrompts(); // Recharge la liste
                        }
                    });
                });
            } else {
                if (!title) { alert("Veuillez entrer un titre."); customTitleInput.focus(); }
                else { alert("Veuillez entrer le texte."); customPromptTextarea.focus(); }
            }
        });
    } else {
        console.warn("ERREUR: Éléments section perso NON trouvés.");
    }
    console.log("Fin de l'initialisation.");
});


// --- Fonction Principale pour Charger et Afficher la liste ---
// Cette fonction lit les prompts depuis le stockage et met à jour l'affichage HTML
function loadAndDisplayPrompts() {
    const promptListUl = document.getElementById('prompt-list');
    if (!promptListUl) { console.error("ERREUR: #prompt-list introuvable !"); return; }
    promptListUl.innerHTML = '<p>Chargement des prompts...</p>';
    const storageKey = 'promptListData';
    chrome.storage.local.get([storageKey], (result) => {
        if (chrome.runtime.lastError) { console.error("ERREUR LECTURE STOCKAGE : ", chrome.runtime.lastError); promptListUl.innerHTML = '<p style="color: red;">Erreur chargement stockage.</p>'; return; } // DEBUG 5
        console.log("Résultat brut:", result);
        const prompts = result[storageKey] || [];
        console.log("Prompts interprétés:", prompts);
        if (!Array.isArray(prompts)) { console.error("ERREUR: Données non-tableau!", prompts); promptListUl.innerHTML = '<p style="color: red;">Erreur: Données corrompues.</p>'; return; } // DEBUG 8
        promptListUl.innerHTML = ''; console.log("Liste vidée."); 
        if (prompts.length === 0) {
            console.log("Aucun prompt trouvé.");
            promptListUl.innerHTML = `<li style="list-style-type: none; text-align: center; padding: 15px; color: #6c757d;">
                    Aucun prompt défini.
                </li>`;
            const optionsBtn = document.getElementById('go-to-options-btn');
            if (optionsBtn) { optionsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage()); }
        } else {
            console.log(`Trouvé ${prompts.length} prompts. Boucle affichage.`); 
            prompts.forEach((promptData, index) => {
                 const listItem = document.createElement('li'); listItem.dataset.promptIndex = index;
                 const itemButton = document.createElement('button'); itemButton.className = 'item prompt-item'; itemButton.textContent = promptData.name; itemButton.title = `Injecter : "${promptData.text?.substring(0, 70)}..."`; itemButton.addEventListener('click', () => { injectPromptText(promptData.text); });
                 const trashButton = document.createElement('button'); trashButton.className = 'trash'; trashButton.textContent = '🗑️'; trashButton.title = 'Supprimer'; trashButton.addEventListener('click', (event) => { event.stopPropagation(); if (confirm(`Supprimer "${promptData.name}" ?`)) { deletePrompt(index); } });
                 listItem.appendChild(itemButton); listItem.appendChild(trashButton);
                 promptListUl.appendChild(listItem);
            });
             console.log("Fin boucle affichage."); 
        }
    });
    console.log("Fin fonction (appel .get asynchrone)."); 
}

// --- Fonction pour SUPPRIMER un prompt ---
function deletePrompt(indexToDelete) {
    console.log(`Suppression demandée pour index ${indexToDelete}`);
    const storageKey = 'promptListData';
    chrome.storage.local.get([storageKey], (result) => {
        if (chrome.runtime.lastError) { console.error("Erreur lecture (suppr): ", chrome.runtime.lastError); return; }
        let prompts = result[storageKey] || [];
        if (indexToDelete >= 0 && indexToDelete < prompts.length) {
            prompts.splice(indexToDelete, 1);
            chrome.storage.local.set({ [storageKey]: prompts }, () => {
                if (chrome.runtime.lastError) { console.error("Erreur sauvegarde (suppr): ", chrome.runtime.lastError); alert("Erreur suppression."); }
                else { console.log("Prompt supprimé."); loadAndDisplayPrompts(); }
            });
        } else { console.error(`Index suppression invalide: ${indexToDelete}`); }
    });
}

// --- Fonction pour INJECTER le texte ---
function injectPromptText(textToInject) {
     console.log(`Injection demandée : "${textToInject}"`);
     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         if (tabs[0]?.id) {
             chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, function: injectTextIntoActiveElement, args: [textToInject] }, (res) => { /* ... gestion erreur/succès ... */ if (chrome.runtime.lastError || res?.[0]?.result === false) { /* ... */ } else { window.close(); } });
         } else { console.error("Onglet actif introuvable."); alert("Erreur: Onglet actif introuvable."); }
     });
}

// --- Fonction injectée dans la page web ---
function injectTextIntoActiveElement(textToInject) {
    const activeElement = document.activeElement; let success = false; if (activeElement) { const isInput = activeElement.tagName === 'INPUT'; const isTextArea = activeElement.tagName === 'TEXTAREA'; const isEditable = activeElement.isContentEditable; if (isInput || isTextArea) { let start = activeElement.selectionStart; let end = activeElement.selectionEnd; let value = activeElement.value; activeElement.value = value.substring(0, start) + textToInject + value.substring(end); activeElement.selectionStart = activeElement.selectionEnd = start + textToInject.length; activeElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); success = true; console.log(`Texte injecté dans ${activeElement.tagName}`); } else if (isEditable) { document.execCommand('insertText', false, textToInject); success = true; console.log("Texte injecté via execCommand."); } else { console.log("Élément non injectable."); } } else { console.log("Aucun élément actif."); } if (!success) return false;
}