document.getElementById("openfile").addEventListener('change',function()
{
  var fr = new FileReader();
  fr.onload = function()
  {
    document.getElementById("fileContents").textContent = this.result;
  }

  fr.readAsText(this.files[0]);
})