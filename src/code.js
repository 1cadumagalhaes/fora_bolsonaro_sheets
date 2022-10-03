function getTSEResults(url="https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/br/br-c0001-e000544-r.json"){
  //make request
  const request = UrlFetchApp.fetch(url);

  const code = request.getResponseCode();
  console.log('Request returned ', code);

  if(code!=200){
    return getTSEResults();
  }

  const result = JSON.parse(request.getContentText("UTF-8").replace('&apos;', "'"));

  //structure return

  const request_timestamp = new Date();

  let {
    ht: update_timestamp, 
    psi: porcentagem_apurados, 
    si: total_apurados, 
    cand: dados_candidatos, 
    pvb: porcentagem_brancos, 
    ptvn: porcentagem_nulos,
    pa: porcentagem_abstencao
    } = result;
  update_timestamp = new Date('2022-10-02T'+update_timestamp);
  dados_candidatos = dados_candidatos.map(({ nm: nome, pvap: porcentagem_votos, vap: total_votos})=>{
    return {
      request_timestamp, 
      update_timestamp,
      nome, 
      total_votos, 
      porcentagem_votos: parseFloat(porcentagem_votos.replace(',', '.'))}
  });
  
  //return json
  return {
    request_timestamp,
    update_timestamp,
    total_apurados,
    porcentagem_apurados: parseFloat(porcentagem_apurados.replace(',','.')),
    porcentagem_brancos: parseFloat(porcentagem_brancos.replace(',','.')),
    porcentagem_nulos: parseFloat(porcentagem_nulos.replace(',','.')),
    porcentagem_abstencao: parseFloat(porcentagem_abstencao.replace(',','.')),
    dados_candidatos
  }
}

//save json to sheets

function saveData(){
  const {
    request_timestamp,
    update_timestamp,
    total_apurados,
    porcentagem_apurados,
    porcentagem_brancos,
    porcentagem_nulos,
    porcentagem_abstencao,
    dados_candidatos
  } = getTSEResults();

  //dados gerais
  writeJsonToSheet([{
    request_timestamp,
    update_timestamp,
    total_apurados,
    porcentagem_apurados,
    porcentagem_brancos,
    porcentagem_nulos,
    porcentagem_abstencao,
  }], 'Dados gerais', true);


  //dados_candidatos
  writeJsonToSheet(dados_candidatos, 'Dados candidatos', true);

  writeJsonToSheet(dados_candidatos, 'Ultimos valores', false);
}





















