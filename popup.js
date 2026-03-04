document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const status = document.getElementById('status');
  const optionsLink = document.getElementById('optionsLink');

  chrome.storage.sync.get(['enabled'], (result) => {
    const enabled = result.enabled !== false; // Par défaut activé
    updateUI(enabled);
  });

  toggleBtn.addEventListener('click', () => {
    chrome.storage.sync.get(['enabled'], (result) => {
      const enabled = !(result.enabled !== false);
      chrome.storage.sync.set({ enabled }, () => {
        chrome.runtime.sendMessage({ action: 'updateRules' });
        updateUI(enabled);
      });
    });
  });

  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  function updateUI(enabled) {
    toggleBtn.textContent = enabled ? 'Enabled' : 'Disabled';
    status.textContent = enabled ? 'ON' : 'OFF';
    toggleBtn.style.backgroundColor = enabled ? '#ff4444' : '#44ff44';
  }
});
