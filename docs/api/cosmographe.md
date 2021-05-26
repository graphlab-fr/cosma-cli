[↩︎ Revenir à la documentation](../../fr.html)

# API du cosmographe

Vous trouverez ci-contre l'ensemble des fonctions utilisées pour la génération du cosmographe.

Ci-dessous un schéma des structures de contrôle.

Les liaisons `-.-` symbolisent l'appartenance et les liaisons `-->` l'utilisation.

```
flowchart LR

verifconfig[[verifconfig.js]]
	verifconfig -.- modifyImportPath
	verifconfig -.- modifyExportPath
	verifconfig -.- addRecordType
	verifconfig -.- addView

autorecord[[autorecord.js]]
	autorecord -.- genMdFile
	autorecord --> verifconfig

links[[links.js]]
	links -.- catchLinksFromContent --> normalizeLink
	links -.- getRank
	links -.- convertLinks --> normalizeLink

log[[log.js]]
	log -.- show
	log -.- register

modelize[[modelize.js]]
	modelize --> registerLinks --> getLinkStyle
	modelize --> registerNodes --> getRank
	modelize --> findFileMeta
	modelize --> getConnectionLevels --> getConnectedIds
	modelize --> show
	modelize --> register
	modelize --> colors
	modelize --> cosmoscope
	modelize --> verifconfig

modelize --> history[[history.js]]

record[[record.js]]
	record --> genMdFile
	record --> verifconfig

template[[template.js]]
	template -.- jsonData
	template -.- colors
	template -.- cosmoscope --> registerType
	cosmoscope --> registerTags
	cosmoscope --> levelsToRadius
	template --> verifconfig

app((app.js))
	app --> modifyImportPath
	app --> modifyExportPath
	app --> addRecordType
	app --> addView
	app --> modelize
	app --> record
	app --> autorecord
```