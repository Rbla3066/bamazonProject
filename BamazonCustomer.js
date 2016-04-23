var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
	host: "localhost",
	user: "public",
	password: "Coolbeans777",
	database: "Bamazon"
});
var products;
function connect(){
	connection.connect(function(err){
		if(err) endConnect();
		getTable(listTable)
	});
};
function getTable(callback){
	connection.query("SELECT * FROM Products", function(err, rows){
		if(err) endConnect();
		products = rows;
		if(callback != undefined) callback();
	});
};
function listTable(){
	for(var i=0; i<products.length; i++){
		console.log(products[i].ItemID+". "+products[i].ProductName + ": $"+products[i].Price+" ("+products[i].Quantity+" available)");
	};
	promptUser();
};
function promptUser(){
	console.log("Which item would you like to buy? Enter the item number.")
	prompt.get(["ItemID", "Quantity"], function(err, result){
		if(err) endConnect();
		var id = parseInt(result.ItemID);
		if(id > products.length || id < 1){
			console.log("Please enter valid ID number");
			promptUser();
			return;
		};
		var num = parseInt(result.Quantity);
		if(num > parseInt(products[id-1].Quantity)){
			console.log("You have requested more "+products[id].ProductName+"s then there are in stock. Please choose a lesser amount.");
			promptUser();
		} else{
			var price = parseFloat(products[id-1].Price);
			console.log(products[parseInt(id)-1].ProductName+" purchased successfully!!");
			console.log("Total cost: $"+(price * num).toFixed(2));
			changeQuantity(id, num);
		};
	});
};
function changeQuantity(id, quantity){
	getTable();
	products[parseInt(id) - 1].Quantity = products[parseInt(id) - 1].Quantity - parseInt(quantity);
	connection.query(
		"UPDATE Products SET Quantity = ? WHERE ItemID = ?",
		[products[parseInt(id)-1].Quantity, id],
		function(err, result) {
			if(err) throw err;
		}
	);
	console.log("Would you like to purchase more?")
	prompt.get(["Y/N"], function(err, result){
		if(err){
			endConnect();
		} else if(result["Y/N"] == "Y") {
			listTable();
		} else {
			endConnect();
		};
	});
};
function endConnect(){
	connection.end(function(err){
		if(err) {
			console.log("An error occured in the your process");
		} else {
			console.log("Thank you for shopping!")
		}
	});
};
connect();
prompt.start();


