chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateRules') {
    updateRules();
  }
});

async function updateRules() {
  const { enabled, blockedSites = [] } = await chrome.storage.sync.get(['enabled', 'blockedSites']);

  // Supprimer les anciennes règles (IDs 1 à 100)
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1)
  });

  if (!enabled || blockedSites.length === 0) return;

  // Ajouter de nouvelles règles
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `*://${site}*`,
      resourceTypes: ['main_frame', 'sub_frame']
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules
  });
}

// Charger au démarrage
updateRules();
