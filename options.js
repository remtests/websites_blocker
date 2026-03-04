document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('sitesList');
  const saveBtn = document.getElementById('save');

  // Charger la liste
  chrome.storage.sync.get(['blockedSites'], (result) => {
    textarea.value = result.blockedSites ? result.blockedSites.join('\n') : '';
  });

  saveBtn.addEventListener('click', () => {
    const sites = textarea.value.split('\n').map(s => s.trim()).filter(Boolean);
    chrome.storage.sync.set({ blockedSites: sites }, () => {
      // Recharger les règles dans le background
      chrome.runtime.sendMessage({ action: 'updateRules' });
      alert('Liste sauvegardée !');
    });
  });
});
