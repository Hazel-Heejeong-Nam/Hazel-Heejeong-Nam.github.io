(function () {
  const map = document.querySelector('.visitor-map');
  const pins = map && map.querySelector('.visitor-map-pins');
  const summary = map && map.querySelector('.visitor-map-summary');
  if (!pins) return;

  const siteId = '9ab7a56d-58fe-4b99-85f8-8a82cc2ed538';
  const origin = 'https://feed-pulse.com';
  const domain = 'hazel-heejeong-nam.github.io';
  const svgNS = 'http://www.w3.org/2000/svg';
  const scale = 87.85352858672623;
  const centerX = 280;
  const centerY = 135.127933;

  function project(longitude, latitude) {
    return [
      centerX + scale * longitude * Math.PI / 180,
      centerY - scale * latitude * Math.PI / 180
    ];
  }

  function trackVisit() {
    if (location.protocol === 'file:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      return Promise.resolve();
    }

    let sessionId;
    try {
      sessionId = sessionStorage.getItem('_ltf_sid');
      if (!sessionId) {
        sessionId = Math.random().toString(36).slice(2, 14);
        sessionStorage.setItem('_ltf_sid', sessionId);
      }
    } catch (error) {
      sessionId = Math.random().toString(36).slice(2, 14);
    }

    return fetch(`${origin}/api/track/${siteId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrer: document.referrer || 'direct',
        landing_page: location.pathname || '/',
        title: document.title.slice(0, 160),
        host: location.host,
        session_id: sessionId
      })
    }).catch(() => {});
  }

  function drawCountries(countries, centroids) {
    pins.replaceChildren();

    countries.forEach((country) => {
      const location = centroids[country.country_code];
      if (!location) return;

      const [x, y] = project(location[0], location[1]);
      const count = Number(country.count) || 0;
      const name = country.country_name || country.country_code;
      const marker = document.createElementNS(svgNS, 'circle');
      const title = document.createElementNS(svgNS, 'title');
      title.textContent = `${name}: ${count.toLocaleString()} visit${count === 1 ? '' : 's'}`;
      marker.setAttribute('cx', x.toFixed(2));
      marker.setAttribute('cy', y.toFixed(2));
      marker.setAttribute('r', Math.min(6, 2.7 + Math.sqrt(count) * 0.7).toFixed(2));
      marker.setAttribute('tabindex', '0');
      marker.setAttribute('aria-label', title.textContent);
      marker.append(title);
      pins.append(marker);
    });

    pins.setAttribute('aria-label', `Visitor countries: ${pins.childElementCount} shown`);
  }

  async function refreshCountries() {
    try {
      const [statsResponse, centroidsResponse] = await Promise.all([
        fetch(`${origin}/api/public/site/${domain}`, { cache: 'no-store' }),
        fetch('assets/maps/visitor-country-centroids.json')
      ]);
      if (!statsResponse.ok || !centroidsResponse.ok) throw new Error('Visitor data unavailable');
      const [stats, centroids] = await Promise.all([
        statsResponse.json(), centroidsResponse.json()
      ]);
      drawCountries(stats.countries || [], centroids);
      if (summary) {
        const visits = Number(stats.total_visits) || 0;
        const countries = (stats.countries || []).length;
        const since = stats.since ? new Date(stats.since) : null;
        const period = since && !Number.isNaN(since.getTime())
          ? ` since ${since.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          : '';
        summary.textContent = `${visits.toLocaleString()} recorded visits · ${countries} ${countries === 1 ? 'country' : 'countries'}${period}`;
      }
    } catch (error) {
      // The map remains visible when the live visitor service is unavailable.
      if (summary) summary.textContent = 'Visit counts are temporarily unavailable.';
    }
  }

  trackVisit().finally(refreshCountries);
})();
