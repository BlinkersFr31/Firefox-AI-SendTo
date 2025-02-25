// A generic onclick callback function.
browser.contextMenus.onClicked.addListener(genericOnClick);

const mistral = "Mistral"
const perplexity = "Perplexity"

let urlKutt = "";
let apiKeyKutt = "";

function removeTrailingSlash(url) {
    if (url.endsWith('/')) {
        return url.slice(0, -1);
    }
    return url;
}

function openPage(myUrl,ai_type) {
    let baseUrl = "";
    switch(ai_type) {
        case mistral:
            baseUrl="https://chat.mistral.ai/chat?q="
            break;
        case perplexity:
            baseUrl="https://www.perplexity.ai/search/new?q="
            break;
    }
    browser.tabs.create({
        url: baseUrl + encodeURIComponent("Résume " + myUrl)
      }, function(window) {
        // Callback function that runs after the window is created
        console.log("Window created with ID: ", window.id);
      });
}

async function callKutt(url1,ai_type) {
	await browser.storage.local.get("urlKutt").then((res) => {
		console.log("urlKutt :", res.urlKutt);
		urlKutt=removeTrailingSlash(res.urlKutt)
	});
	await browser.storage.local.get("apiKeyKutt").then((res) => {
		console.log("apiKeyKutt :", res.apiKeyKutt);
		apiKeyKutt=res.apiKeyKutt
	});
	
    const data = {
      "target": url1,
      "description": "For perplexity AI",
      "expire_in": "2 minutes",
      "reuse": false
    };

	if (urlKutt == undefined || urlKutt === "") {
		openPage(url1,ai_type);
	}
	else {
		const apiKuttUrl = urlKutt + '/api/v2/links'
		fetch(apiKuttUrl, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': apiKeyKutt
		  },
		  body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(result => {
		  console.log('URL raccourcie :', result.link);
		  openPage(result.link,ai_type);
		})
		.catch(error => {
		  console.error('Erreur :', error);
		});
	}
}

// A generic onclick callback function.
function genericOnClick(info) {
  let lien = "";
  let itemId = info.menuItemId.split('-')[0];
  let ai_type = info.menuItemId.split('-')[1];
  switch (itemId) {
    case 'radio':
      // Radio item function
      console.log('Radio item clicked. Status:', info.checked);
      break;
    case 'checkbox':
      // Checkbox item function
      console.log('Checkbox item clicked. Status:', info.checked);
      break;
    case 'link':
      lien = info.linkUrl;
      callKutt(lien,ai_type);
      break;
    default:
      // Standard context menu item function
      console.log('Standard context menu item clicked.');
      console.log(info)
  }
}

browser.runtime.onStartup.addListener(() => {
    console.log("Navigateur démarré et extension chargée.");
    browser.storage.local.get("urlKutt").then((data) => {
        // Une fois la promesse résolue, la constante est initialisée
        urlKutt = data.urlKutt;
        console.log("Constante initialisée :", urlKutt);
    });
    browser.storage.local.get("apiKeyKutt").then((data) => {
        // Une fois la promesse résolue, la constante est initialisée
        apiKeyKutt = data.apiKeyKutt;
        console.log("Constante initialisée :", apiKeyKutt);
    });
    
});

browser.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  let contexts = [
    'page',
    'selection',
    'link',
    'editable',
    'image',
    'video',
    'audio'
  ];
  for (let i = 0; i < contexts.length; i++) {
    let context = contexts[i];
    let titleP = "";
    let titleM = "";
    switch (context) {
        case 'page':
            titleP = "Perplexity AI : envoyer la page";
            titleM = "Mistral AI : envoyer la page";
            break;
        case 'selection':
            titleP = "Perplexity AI : envoyer la sélection";
            titleM = "Mistral AI : envoyer la sélection";
            break;
        case 'link':
            titleP = "Perplexity AI : envoyer le lien";
            titleM = "Mistral AI : envoyer le lien";
            break;
        default:
            titleP = "Perplexity AI '" + context + "' menu item";
            titleM = "Mistral AI '" + context + "' menu item";
    }
    browser.contextMenus.create({
      title: titleP,
      contexts: [context],
      id: context + "-" + perplexity
    });
    browser.contextMenus.create({
      title: titleM,
      contexts: [context],
      id: context + "-" + mistral
    });
  }

});

