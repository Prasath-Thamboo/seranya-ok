import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  seo: number;
}

export async function getLighthouseMetrics(url: string): Promise<LighthouseMetrics> {
  // Lance Chrome avec des options headless
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  // Options pour Lighthouse
  const options = {
    logLevel: 'info' as 'info',  // Correction : forcer le type à être l'un des niveaux de log acceptés
    output: 'json' as 'json',    // Correction : forcer le type à être 'json'
    onlyCategories: ['performance', 'accessibility', 'seo'],
    port: chrome.port,
  };

  // Exécute Lighthouse avec l'URL et les options
  const runnerResult = await lighthouse(url, options);

  // Vérifiez si runnerResult est valide
  if (!runnerResult || !runnerResult.lhr) {
    await chrome.kill();
    throw new Error('Lighthouse runnerResult is undefined or invalid');
  }

  const { categories } = runnerResult.lhr;

  // Ferme Chrome après l'exécution
  await chrome.kill();

  // Retourne les scores avec vérification des valeurs nulles
  return {
    performance: categories.performance?.score ? categories.performance.score * 100 : 0,
    accessibility: categories.accessibility?.score ? categories.accessibility.score * 100 : 0,
    seo: categories.seo?.score ? categories.seo.score * 100 : 0,
  };
}
