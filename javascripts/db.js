var html5rocks = {};
html5rocks.webdb = {};

html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5rocks.webdb.db = openDatabase("Todo", "1", "Todo manager", dbSize);
}

html5rocks.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

html5rocks.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  // loadTodoItems is defined in Step 4a
  html5rocks.webdb.getAllTodoItems(loadTodoItems);
}

// ID - a incrementing sequential ID column
// todo - a text column that is the body of the item
// added_on - the time that the todo item was created

html5rocks.webdb.createTable = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS " +
                  "todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
  });
}

html5rocks.webdb.addTodo = function(todoText) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    var addedOn = new Date();
    tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
        [todoText, addedOn],
        html5rocks.webdb.onSuccess,
        html5rocks.webdb.onError);
   });
}


html5rocks.webdb.getAllTodoItems = function(renderFunc) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM todo", [], renderFunc,
        html5rocks.webdb.onError);
  });
}


function loadTodoItems(tx, rs) {
  var rowOutput = "";
  var todoItems = document.getElementById("todoItems");
  for (var i=0; i < rs.rows.length; i++) {
    rowOutput += renderTodo(rs.rows.item(i));
  }

  todoItems.innerHTML = rowOutput;
}


function renderTodo(row) {
  return "<li>" + row.todo + 
         " [<a href='javascript:void(0);' onclick=\'html5rocks.webdb.deleteTodo(" + 
         row.ID +");\'>Delete</a>]</li>";
}
