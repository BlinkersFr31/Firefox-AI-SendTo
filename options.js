// Charger les paramètres enregistrés et mettre à jour l'interface utilisateur
function restoreOptions() {
  browser.storage.local.get("urlKutt").then((res) => {
    document.getElementById("urlKutt").value = res.urlKutt || "";
  });
  browser.storage.local.get("apiKeyKutt").then((res) => {
    document.getElementById("apiKeyKutt").value = res.apiKeyKutt || "";
  });
  document.getElementById("save").addEventListener("click", saveOptions);
}

// Enregistrer les paramètres lorsque l'utilisateur clique sur le bouton
function saveOptions() {
  const urlKutt = document.getElementById("urlKutt").value;
  browser.storage.local.set({ urlKutt });
  const apiKeyKutt = document.getElementById("apiKeyKutt").value;
  browser.storage.local.set({ apiKeyKutt });
}

// Ajouter des écouteurs d'événements
document.addEventListener("DOMContentLoaded", restoreOptions);

