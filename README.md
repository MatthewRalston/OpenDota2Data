# README

OpenDota2Data is a Node.js project for retrieving data from the OpenDota API and merging/reformating data for visualziations. Currently, many data views are year-centric, as analyzing team performance over longer timespans is made inappropriate by player switching, patch semantics, and other strategic/meta idiosyncracies.

# CLI
Currently, the only implemented function is a CLI. After providing a year, data from The International Dota 2 competition is retrieved, including all playermatches, directly from the OpenDota Explorer function and then adding `players` and `matches` arrays to the root of the object

```javascript
{
  ...
  "rows": [...],
  "players": [...],
  "matches": [...]
}
```

Match data can be sorted and filtered by team name and several other attributes. A team centric view may be important for looking at co-occurence relationships in teamfights.

```bash
./bin/opendota --help # usage information
./bin/opendota getTIData|y 2017
```


# App

In the future, I'll develop a REST API for accessing data in certain 'team' centric views, and more. For example, beginning with a team centric query to the OpenDota explorer, we can retrieve all matches in TI (or otherwise) for team DC. Then we retrieve each of these matches (in background), and we can look at co-occurrence of certain carry/support pairs and their performance in teamfights.


# Installation
```bash
git clone https://github.com/MatthewRalston/OpenDota2Data.git
npm install
```
