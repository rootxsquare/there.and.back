

async function test() {
  const country = 'India';
  const query = `
    SELECT ?itemLabel ?pic ?article ?sitelinks WHERE {
      ?country wdt:P31/wdt:P279* wd:Q6256.
      ?country rdfs:label "${country}"@en.
      ?item wdt:P31/wdt:P279* wd:Q570116.
      ?item wdt:P17 ?country.
      ?item wdt:P18 ?pic.
      ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/>.
      ?item wikibase:sitelinks ?sitelinks.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY DESC(?sitelinks)
    LIMIT 3
  `;
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`;
  
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/sparql-results+json', 'User-Agent': 'TravelGo/1.0' } });
    if (!res.ok) throw new Error(res.status + ' ' + await res.text());
    const data = await res.json();
    console.log(JSON.stringify(data.results.bindings, null, 2));
  } catch (err) {
    console.error(err);
  }
}
test();
