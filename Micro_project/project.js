var connectionToken="90932997|-31949325362030767|90949676";
var dbname ="COLLEGE-DB";
var relName = "PROJECT-TABLE";
var baseUrl ="http://api.login2explore.com:5577";
var imlUrl ="/api/iml";
var irlUrl ="/api/irl";


$("#projectId").focus();
$("#projectName").prop("disabled",true);
$("#assignedTo").prop("disabled",true);
$("#assignmentDate").prop("disabled",true);
$("#deadline").prop("disabled",true);
$("#pSave").prop("disabled",true);
$("#pChange").prop("disabled",true);
$("#pReset").prop("disabled",true);

// to save record no in the local storage of browser
function saveRecordNoToLocalStorage(jsonIdObj)
{
    var lvData=JSON.parse(jsonIdObj.data);
    localStorage.setItem("recno",lvData.rec_no);
}
function getIdasJsonObj()
{
    var idval=$("#projectId").val();
    var jsonStr ={ Id: idval};
    return JSON.stringify(jsonStr);
}
function fillData(jsonIdObj)
{
    saveRecordNoToLocalStorage(jsonIdObj);
    var record = JSON.parse(jsonIdObj.data).record;
    $("#projectName").val(record.Name);
    $("#assignedTo").val(record.AssignedTo);
    $("#assignmentDate").val(record.AssignmentDate);
    $("#deadline").val(record.Deadline);
}
function getRecord()
{
    var jsonIdObj = getIdasJsonObj();
    alert(jsonIdObj);

    var getRequest = createGET_BY_KEYRequest(connectionToken,dbname,relName,jsonIdObj);
      alert(getRequest);
    //  stopping ajax 
     jQuery.ajaxSetup({async: false});
     var resultJsonObj = executeCommandAtGivenBaseUrl(getRequest,baseUrl,irlUrl);
     jQuery.ajaxSetup({async: true});
     alert(resultJsonObj.status);
    // 200 for success  
    // 401 for error, error due to Invalid Token.
    //  400 for error, error can be due to syntax or data not found.
      if(resultJsonObj.status === 400 )
      {
        // record with jsonIdObj.id does not exist
        $("#projectName").prop("disabled",false);
        $("#assignedTo").prop("disabled",false);
        $("#assignmentDate").prop("disabled",false);
        $("#deadline").prop("disabled",false);
        $("#pSave").prop("disabled",false);
        $("#pReset").prop("disabled",false);
        $("#projectName").focus();
      }
      else if(resultJsonObj.status === 401 )
      {
         alert("Error 401 ... token is not valid. ");
         resetForm();
      }
      else if(resultJsonObj.status === 200)
      {
        $("#projectName").prop("disabled",true);
        fillData(resultJsonObj);
        $("#projectName").prop("disabled",false);
        $("#assignedTo").prop("disabled",false);
        $("#assignmentDate").prop("disabled",false);
        $("#deadline").prop("disabled",false);
        $("#pChange").prop("disabled",false);
        $("#pReset").prop("disabled",false);
        $("#projectName").focus();
      }
}

// to validate and if valid return jsonStr
function validateForm() {
    var pId = $("#projectId").val();
    if (pId === "") {
    alert("Project ID is a Required Value!");
    $("#projectId").focus();
        return "";
    }
    var pName = $("#projectName").val();
    if (pName === "") {
    alert("Project name is missing!");
    $("#projectName").focus();
        return "";
    }
    var passignedTo = $("#assignedTo").val();
    if (passignedTo === "") {
    alert("Project Incharge name is missing!");
    $("#assignedTo").focus();
        return "";
    }
    var startDate = $("#assignmentDate").val();
    if (startDate === "") {
    alert("Assignment Date is missing!");
    $("#assignmentDate").focus();
        return "";
    }
    var endDate = $("#deadline").val();
    if (endDate === "") {
    alert("Deadline is missing!");
    $("#deadline").focus();
        return "";
    }
    var jsonStrObj = {
    Id: pId,
    Name: pName,
    AssignedTo: passignedTo,
    AssignmentDate : startDate,
    Deadline : endDate,
    };
    
    return JSON.stringify(jsonStrObj);
    }
  
function saveForm()
{
    var jsonStr = validateForm();
   
    if(jsonStr === "")
     return;

     var putRequest = createPUTRequest(connectionToken, jsonStr, dbname , relName);
     alert("Request send successfully!");
    //  stopping ajax 
     jQuery.ajaxSetup({async: false});
     var resultObj = executeCommandAtGivenBaseUrl(putRequest,baseUrl,imlUrl);
     jQuery.ajaxSetup({async: true});
     alert("Record is entered successfully");
     resetForm();

}
function updateForm()
{
    $("#pChange").prop("disabled",true);
    jsonUdate = validateForm();
    var updateRequest = createUPDATERecordRequest(connectionToken,jsonUdate ,dbname, relName, localStorage.getItem("recno"));
     //  stopping ajax 
     jQuery.ajaxSetup({async: false});
     var resultObj = executeCommandAtGivenBaseUrl(updateRequest,baseUrl,imlUrl);
     jQuery.ajaxSetup({async: true});
    alert("Already existing record is updated successfully!");
    resetForm();
}
function resetForm()
{
    $("#projectId").val("");
    $("#projectName").val("");
    $("#assignedTo").val("");
    $("#assignmentDate").val("");
    $("#deadline").val("");
    $("#projectId").focus();
    $("#projectName").prop("disabled",true);
    $("#assignedTo").prop("disabled",true);
    $("#assignmentDate").prop("disabled",true);
    $("#deadline").prop("disabled",true);
    $("#pSave").prop("disabled",true);
    $("#pChange").prop("disabled",true);
    $("#pReset").prop("disabled",true);
}