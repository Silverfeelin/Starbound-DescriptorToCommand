$(function(){
  clipboard = new Clipboard(".btnCopy");

  // Bind input button
  $("#inputFile").hide();
  $("#btnSelectFile").click(function() {
    $("#inputFile").trigger('click');
  });
  $("#inputFile").change(function(){
     var file = this.files[0];
     readFile(file);
   });
  
  // Bind output buttons
  $("#btnTextCommand").click(showCommand);
  $("#btnExportCommand").click(exportCommand);
})

function readFile(file) {
  var reader = new FileReader();
  reader.onload = fileLoaded;
  reader.onerror = fileErrored;
  reader.readAsText(file);
}

function fileLoaded(e) {
  exportCommand(e.target.result);
}

function fileErrored(e) {
  $("#output").get(0).value = e.target.error;
}

function showCommand() {
  try {
    var res = generateCommand();
    var domOutput = $("#output").get(0);
    domOutput.value = res;  
  } catch(e) {
    $("#output").get(0).value = e;
  }
}

function exportCommand(input) {
  try {
    var res = generateCommand(input);
    var blob = new Blob([ res ], {type: "text/plain;charset=utf8"});
    saveAs(blob, "SpawnItemCommand.json");
  } catch(e) {
    $("#output").get(0).value = e;
  }
}

function generateCommand(input) {
  if (typeof(input) !== "string") {
    input = $("#text").get(0).value;
  }
  var descriptor;
  
  descriptor = JSON.parse(input);
  
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