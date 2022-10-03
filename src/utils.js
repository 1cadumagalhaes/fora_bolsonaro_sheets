function request(url){
  const request = UrlFetchApp.fetch(url);

  const code = request.getResponseCode();
  console.log('Request returned ', code);

  const result = JSON.parse(request.getContentText("UTF-8")
                      .replace('&apos;', "'"));
  return result;
}

function writeJsonToSheet(json_data, sheet_name, concat=false){

  if(!sheet_name) throw 'Sheet name invalido';

  if(json_data && Array.isArray(json_data) && json_data.length>=1){

    console.log(`Escrevendo ${json_data.length} dados em ${sheet_name} com concat ${concat}`);
    let startRow = 1, startColumn = 1;
    const header = Object.keys(json_data[0]);

    const body = json_data.map(row=>Object.values(row));

    let values = [header, ...body]; ///mudar

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheet_name);

    if(concat){
      values = values.slice(1);
      startRow = sheet.getLastRow();
    }
    const range = sheet.getRange(startRow,startColumn,values.length, header.length); //mudar
    range.setValues(values);

  } else{
    throw 'Dados inválidos';
  }
}
