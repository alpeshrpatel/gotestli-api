var my_json = [{created_at: "2017-03-14T01:00:32Z", entry_id: 33358, field1: "4", field2: "4", field3: "0"},{created_at: "2019-03-14T01:00:32Z", entry_id: 33359, field1: "4", field2: "4", field3: "0"}];

var data =[];
var dataSet=[];
	my_json.forEach((val,index)=>{
		if(my_json[index]!==null){
			for(var i in my_json[index]) {
					data.push(my_json[index][i]);
			}
			dataSet.push(data);
			data=[];
		}	
	})
console.log("...java Script Array... \n"+JSON.stringify(dataSet));