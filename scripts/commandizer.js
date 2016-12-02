$(function(){
    clipboard = new Clipboard(".btnCopy");
    
     $("#btnTextCommand").click(showCommand);
     $("#btnExportCommand").click(exportCommand);
})

function showCommand() {
    var res = generateCommand();
    if (typeof res === "string") {
      var domOutput = $("#output").get(0);
      domOutput.value = res;  
    }
}

function exportCommand() {
    var res = generateCommand();
    var blob = new Blob([ res ], {type: "text/plain;charset=utf8"});
    saveAs(blob, "SpawnItemCommand.json");
}

function generateCommand () {
  var input = $("#text").get(0).value;
  var descriptor;
  
  // Check input syntax
  try {
    descriptor = JSON.parse(input);
  } catch(e) {
    $("#output").get(0).value = e;
    return;
  }
  
  // Check input
  if (!descriptor.hasOwnProperty("name") || typeof descriptor.name !== "string")
  {
    descriptor.name = "perfectlygenericitem";
  }
  if (!descriptor.hasOwnProperty("count")  || typeof descriptor.count !== "number")
  {
    descriptor.count = 1;
  }
  if (descriptor.hasOwnProperty("parameters"))
  {
    descriptor.parameters = escapeObject(descriptor.parameters);
  }
  
  var cmd = "/spawnitem " + descriptor.name + " " + descriptor.count;
  if (descriptor.hasOwnProperty("parameters"))
  {
    cmd += " '" + JSON.stringify(descriptor.parameters).replace(/'/g, "\\'") + "'";
  }
  
  return cmd;
}

function escapeObject(jsonObject) {
  jQuery.each(jsonObject, function(key, value) {
    if (typeof value === "string") {
      jsonObject[key] = value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    } else if (typeof value === "object") {
      jsonObject[key] = escapeObject(value);
    }
  });
  return jsonObject;
}