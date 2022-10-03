function getTSEResults(){
  const url="https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/br/br-c0001-e000544-r.json";
    const result = request(url);
  const request_timestamp = new Date();

  let {
    ht: update_timestamp, 
    psi: porcentagem_apurados, 
    vv: total_apurados, 
    cand: dados_candidatos, 
    pvb: porcentagem_brancos, 
    ptvn: porcentagem_nulos,
    pa: porcentagem_abstencao
    } = result;

  update_timestamp = new Date('2022-10-02T'+update_timestamp);

  dados_candidatos = dados_candidatos.map(
    ({ nm: nome, pvap: porcentagem_votos, vap: total_votos})=>{
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
  
  updateCoverage();
}


function updateCoverage(){
  let url_estados = `https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/sp/sp-c0001-e000544-r.json`;

  const estados = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('estados');

  let values = estados.getRange('A2:C28').getValues();

  
  values= values.map((row)=>{
    const sigla = row[2].toLowerCase()
    const url = `https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/${sigla}/${sigla}-c0001-e000544-r.json`;
    console.log(url);
    const results = request(url);
    let candidatos = parseCand(results.cand);
    return [
      ...row, 
      parseFloat(results.psi.replace(',','.')), 
      candidatos["LULA"], 
      candidatos["JAIR BOLSONARO"]]
  })

  estados.getRange('A2:F28').setValues(values);
}


function parseCand(cand){
  return Object.fromEntries(
    cand.map(
      ({nm: name, pvap: porcentatem})=>
      [name,parseFloat(porcentatem.replace(',','.'))]
      )
  );
}






