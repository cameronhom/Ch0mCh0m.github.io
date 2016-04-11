/*
Main JS for tutorial: "Getting Started with HTML5 Local Databases"
Written by Ben Lister (darkcrimson.com) revised May 12, 2010
Tutorial: http://blog.darkcrimson.com/2010/05/local-databases/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

$(function(){ 
	
	var localDBDemo = {
		init: function () {
			
			this.initDatabase();
			
			// Button and link actions
			$('#clear').on('click', function(){ 
				localDBDemo.dropTables(); 
			});
			
		 	$('#update').on('click', function(){ 
		 		localDBDemo.updateSetting(); 
		 	});

		},

		initDatabase: function() {
			try {
			    if (!window.openDatabase) {
			        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
			    } else {
			        var shortName = 'DEMODB',
			        	version = '1.0',
						displayName = 'DEMODB Test',
						maxSize = 100000; // in bytes
						
			        DEMODB = openDatabase(shortName, version, displayName, maxSize);
					this.createTables();
					this.selectAll();
			    }
			} catch(e) {
			    if (e === 2) {
			        // Version mismatch.
			        console.log("Invalid database version.");
			    } else {
			        console.log("Unknown error "+ e +".");
			    }
			    return;
			} 
		},
		
		/***
		**** CREATE TABLE ** 
		***/
		createTables: function() {
			var that = this;
			DEMODB.transaction(
		        function (transaction) {
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS page_settings(id INTEGER NOT NULL PRIMARY KEY, fname TEXT NOT NULL,bgcolor TEXT NOT NULL, font TEXT, favcar TEXT);', [], that.nullDataHandler, that.errorHandler);
		        }
		    );
			this.prePopulate();			
		},

		/***
		**** INSERT INTO TABLE ** 
		***/		
		prePopulate: function() {
			DEMODB.transaction(
			    function (transaction) {
				//Starter data when page is initialized
				var data = ['1','none','#B3B4EF','Helvetica','Porsche 911 GT3'];  
				
				transaction.executeSql("INSERT INTO page_settings(id, fname, bgcolor, font, favcar) VALUES (?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4]]);
			    }
			);				
		},
		
		/***
		**** UPDATE TABLE ** 
		***/
	    updateSetting: function() {
			DEMODB.transaction(
			    function (transaction) {
					var fname,
					bg    = $('#bg_color').val(),
					font  = $('#font_selection').val(),
					car   = $('#fav_car').val();
					
			    	if($('#fname').val() != '') {
			    		fname = $('#fname').val();
			    	} else {
			    		fname = 'none';
			    	}
					
			    	transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);
			    }
			);	
			
			this.selectAll();		    
	    },
	    
	    selectAll: function() {
	    	var that = this;
			DEMODB.transaction(
	    		function (transaction) {
					transaction.executeSql("SELECT * FROM page_settings;", [], that.dataSelectHandler, that.errorHandler);
	        
				}
			);	
	    },
	    
	    dataSelectHandler: function( transaction, results ) {
			// Handle the results
			var i=0,
				row;
				
		    for (i ; i<results.rows.length; i++) {
		        
		    	row = results.rows.item(i);
		        
		        $('body').css('background-color',row['bgcolor']);
		        $('body').css('font-family',row['font']);
		        $('#content').html('<h4 id="your_car">Your Favorite Car is a '+ row['favcar'] +'</h4>');
		        
		        if(row['fname'] != 'none') {
		       		$('#greeting').html('Howdy-ho, '+ row['fname'] +'!');
		       		$('#fname').val( row['fname'] );
		        } 
		        
		       $('select#font_selection').find('option[value="'+ row['font'] +'"]').attr('selected','selected');
		       $('select#bg_color').find('option[value="'+ row['bgcolor'] +'"]').attr('selected','selected');  
		       $('select#fav_car').find('option[value="'+ row['favcar'] +'"]').attr('selected','selected');
		
		    }		    
	    },
	    
		/***
		**** Save 'default' data into DB table **
		***/
	    saveAll: function() {
		    this.prePopulate(1);
	    },
	    
	    errorHandler: function( transaction, error ) {
	    
		 	if (error.code===1){
		 		// DB Table already exists
		 	} else {
		    	// Error is a human-readable string.
			    console.log('Oops.  Error was '+error.message+' (Code '+ error.code +')');
		 	}
		    return false;		    
	    },
	    
	    nullDataHandler: function() {
		    console.log("SQL Query Succeeded");
	    },
	    
		/***
		**** SELECT DATA **
		***/	    
	    selectAll: function() {
	    	var that = this;
			DEMODB.transaction(
			    function (transaction) {
			        transaction.executeSql("SELECT * FROM page_settings;", [], that.dataSelectHandler, that.errorHandler);
			    }
			);			    
	    },
	    
		/***
		**** DELETE DB TABLE ** 
		***/
		dropTables: function() {
			var that = this;
			DEMODB.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE page_settings;", [], that.nullDataHandler, that.errorHandler);
			    }
			);
			console.log("Table 'page_settings' has been dropped.");
			//location.reload();			
		}
	    

	};

 	
 	//Instantiate Demo
 	localDBDemo.init();
	
});	