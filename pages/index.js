var univclick = false;
var teacherclick = false;
var classclick = false;

function txboxuniv()
{
  it = document.getElementById("university");
  if (!univclick)
  {
    univclick = true;
    it.value = "";
    it.style.color = "#000000";    
  }
    
}

function txboxunivblur()
{
  it = document.getElementById("university");  
  if (it.value == "")
  {
      it.value = "University";
      univclick = false;
      it.style.color = "#cccccc";    
  }  
}

function txboxteach()
{
  it = document.getElementById("teacher");
  if (!teacherclick)
  {
    teacherclick = true;
    it.value = "";
    it.style.color = "#000000";        
  }
    
}

function txboxteachblur()
{
  it = document.getElementById("teacher");  
  if (it.value == "")
  {
      it.value = "Teacher";
      teacherclick = false;
      it.style.color = "#cccccc";        
  }  
}

function txboxclass()
{
  it = document.getElementById("class");
  if (!classclick)
  {
    classclick = true;
    it.value = "";
    it.style.color = "#000000";        
  }
    
}

function txboxclassblur()
{
  it = document.getElementById("class");  
  if (it.value == "")
  {
      it.value = "Class";
      classclick = false;
      it.style.color = "#cccccc";        
  }  
}