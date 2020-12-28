(async () => {
  const { dockStart } = require('@nlpjs/basic');
  const corpusEn = require(__dirname + "/corpus-en.json");
  const corpusFi = require(__dirname + "/corpus-fi.json");

  const dock = await dockStart({ use: ['Basic', 'LangFi']});
  const nlp = dock.get('nlp');

  await nlp.addCorpus(corpusEn);
  await nlp.addCorpus(corpusFi);
  await nlp.train();
  
  await nlp.save(__dirname + "/../src/nlp/nlp.json");
})();