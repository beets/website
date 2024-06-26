# Tool to generate sitemap files

This tool generate the sitemap files based on the [sitemap protocol](https://www.sitemaps.org/protocol.html).
The generated sitemap files are served as [static files](https://datacommons.org/sitemap/*).

## Update sitemap files

```bash
./run.sh
```

Review the git difference and commit the newly updated files.

## Updating Priority Places Sitemap

The `PriorityPlaces.0.txt` sitemap is used for evaluating and tracking our
search indexing and ranking for some core place pages. It contains the place
page URLs for:

* All US States and Washington DC
* The top 100 most populous US cities
* All cities around the world with a population of at least 500,000

The query necessary to get all cities around the world with a population >=500k
is too heavy for our python sparql API, so those places are generated by
querying the `dc_kg_latest` tables in BigQuery directly. The result of the query
has been saved in `cities_with_population_over_500k.csv`, which is then used by
`./run.sh` when generating `PriorityPlaces.0.txt`.

To update the CSV, use the following BQ query and export the results:

```sql
SELECT DISTINCT
  `datcom-store.dc_kg_latest.Place`.id AS dcid,
  `datcom-store.dc_kg_latest.Place`.name,
  CAST(`datcom-store.dc_kg_latest.StatVarObservation`.value AS FLOAT64) AS population
FROM `datcom-store.dc_kg_latest.Place`
JOIN `datcom-store.dc_kg_latest.StatVarObservation` ON `datcom-store.dc_kg_latest.Place`.id = `datcom-store.dc_kg_latest.StatVarObservation`.observation_about
WHERE
  `datcom-store.dc_kg_latest.Place`.type = 'City'
  AND `datcom-store.dc_kg_latest.StatVarObservation`.variable_measured = 'Count_Person'
  AND CAST(`datcom-store.dc_kg_latest.StatVarObservation`.value AS FLOAT64) >= 500000
ORDER BY population DESC;
```
