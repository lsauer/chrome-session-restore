
    // author: (c) 2011 by Lorenz Lo Sauer; lsauer.com
    // 
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    // 
    // The above copyright notice and this permission notice shall be included in
    // all copies or substantial portions of the Software.
    // 
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    // THE SOFTWARE.
    //
    // Design 10/2011 by Lo Sauer, MIT-LICENSE or BSD-LICENSE
    // Design of the Chromium Logo by Google Inc.; Parts are Chrome CSS - BSD license applies

		/**
		* islib: see here for more; any unused functions are stripped
		*/
		var is = (function(){
		  return {
			xhrStatus : {},    //holds the status of the most recent XHR call
			Debug : false,    //<boolean> e.g. allow failing by throwing errors, logging...
			get FileAccess()  { return typeof(window.File) !== 'undefined' && typeof(window.FileReader) === 'function' && typeof(window.FileList) !== 'undefined'; },
   			get DragSupport()    { var el = document.getElementsByTagName('body')[0]; if(!el) return false; else return el.hasOwnProperty('ondragenter') && el.hasOwnProperty('ondragend'); },
			Unique : function(a){ return a.sort().filter( function(v,i,o){if(i>0 && v!==o[i-1]) return v;}); },
		  }})();
		
		/**
		* simple multi timer
		*/
		j2timer();
		function j2timer(e){ 
			window.tdiff || (window.tdiff = []);
			window.tdlog || (window.tdlog = []);
			window.fnred || (window.fnred = function(a,b){return a-b;});
			
			//toogle statement
			if( (tdiff.length+1) % 2){
				tdiff.push( Date.now());
				return;
			}
			tdlog.push(["TIMER:", Date.now()-tdiff[tdiff.length-1], "[msec]; NOW:", Date.now(), "; WHO:", e, this.constructor.toString().split("(")[0]]);
			//commet this line out
			//console.log(tdlog.pop().join(" ") );
		}
		
		//------------IMPLEMENTATION----------------//
		function eventstop(e){
			e.stopPropagation();
			e.preventDefault();
		};
		
		/**
		* concise element selector function; 09/2011
		*/
		function gEl(name){ //get Element by name [+childName]
			if( document.getElementById(name) != undefined )
				return document.getElementById(name);
			else 
				return document.getElementsByName(name)[0]; //first el is returned!
		}
		
		function gel(name, child){ //get Element by name [+childName]
			var el;
			if( name instanceof HTMLElement )
				el = name;
			else
				if( document.getElementById(name) != undefined )
					el = document.getElementById(name);
				else 
					el = document.getElementsByName(name)[0];
			if(child === undefined || el === undefined) 
				return el;
				
			//search first within, otherwise outside...
			var regx = new RegExp(child, "gi");
			for(var i=0, els = el.children; i<els.length; i++ ){
				if( regx.test(els[i].tagName) || regx.test(els[i].id) ){
					return els[i];
				}
			}
			for(var i=0, els = el.parentNode.children; i<els.length; i++ ){
				if( regx.test(els[i].tagName) || regx.test(els[i].id) ){
					return els[i];
				}
			}
		}
		
		/**
		* HTMLElement Class- Functions. Elements can have several classes which are separated by a space ' '
		*/		
		Classy = function(el){
			return {
				self : el, //set to DOM element
				has : function (cls, ele) {
						if( this.self ) ele =  this.self;
						return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
					},
				add : function (cls, ele) {
					if( this.self ) ele =  this.self;
					if (!this.has(cls, ele)) ele.className += " " + cls;
				},
				del : function (cls, ele) {
					if( this.self ) ele =  this.self;
					if (this.has(cls, ele)) {
						var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
						ele.className = ele.className.replace(reg, ' ');
					}
				},
				repl : function (cls, ele)  {
					if( this.self ) ele =  this.self;
					if(!this.has(cls, ele)) {
						this.add(cls, ele);
					}
				}
			};
		};

		/**
		* ONLOAD Functions
		*/		
		window.onload = function(){
			document.addEventListener('click', 
				function(){ gEl('recent-menu').style.display = "none";
					}
			);
			//add toggle listener
			gel('recently-closed-menu-button').onclick = function(e){
				var el = gEl('recent-menu');
				if(el.style.display === 'none')
					el.style.display = 'block';
				else
					el.style.display = 'none';

				//without cancelBubble, the event would bubble to document, which would set the menu display to none!
				e.cancelBubble = true;
				return;
			};

			//converter codebase
			j2 = {
				fLarge : 3000000,
				elLi : 			gEl('liWebservice'),
				elLiOpt : 		gEl('liOptions'),
				elSp : 			gEl('spWservtxt'),
				elIF : 			gEl('jsonfiles'),
				elTxtBxj :		gEl('footer'),
				elFlist : 		gEl('fileslist'),
				elChkRev :		gEl('sql2json'),
				elChkFget :		gEl('getfile'),
				elChkCompr :	gEl('compress'),
				cls :			new Classy( gel('gEl') ),
				data : 			null,
				freader : 		new FileReader(),
				win	: 			null,
			};

			function openTabsWin(url, name) {
				// Change "_blank" to something like "newWindow" to load all links in the same new window
				//if(null === j2.win)
					j2.win = window.open(url, window.name);
				//else if(j2.win && j2.win.DOMException )
				//	j2.win.open('sdf'+url, name || '_popup');
				j2.win.focus();
				return false;
			}
			//gEl('liWebservice').parentNode.children[1]
			with(j2)
			{
				//hide file-input box on FileReader browsers
				if( is.FileAccess && is.DragSupport ){
					elIF.style.display = 'none';
				}else{
					elIF.onchange = function(e)
					{
						var files; 
						// can't use: e.constructor === MouseEvent.constructor
						if( e instanceof MouseEvent ){
							files = e.dataTransfer.files; // FileList object.
						} else if( e instanceof Event && j2.elIF.files instanceof FileList ){
							files =  j2.elIF.files; // FileList object. or e.target.files
						}else{
							console.log("FILE accession unsucessful", e), e.target.files;
							return false;
						}
						if(j2.freader && j2.freader.onload){
							freader.readAsText(files[0]);
						}
							
						//j2.freader.onload({target : {result: files[0]}});	//quick hack	
						 eventstop(e);
					}
				}
				
				/**
				* DnD Uploader logic
				*/		
				function xhrUploader(el) {		
					var cls = new Classy( gel('jsontext') );			
					var cssClassDrag = 'footer-drag';
					//typeof(window.File) is function or object
					// if DnD is supported... should evaluate true in Chrome > v 12
					var freader = j2.freader;
					if( is.FileAccess ) {

						freader.onerror = function(e) { console.error('File error', e, e.target); };
						//freader.onprogress = mconf.loader.onProgress;
						freader.onabort = function(e) { console.error('File read cancelled'); };

						freader.onload = function(e) 
						{
								var maxopen = +gel('maxtabs').value || 5;	//max number of popups to open
								var elmenu = gel('recent-menu');
							  //console.log("onload:", e.target.result)
							  j2.data = e.target.result;
							  //Process file and build tab-list
							  //update: (ftp|http|htttp) -> [fht]+tps?; /(^(ftp|http|htttp):\/\/[a-z0-9|&!%$()?.\/=+#-;]+)/ -> [ -^] ; see my gists
							  var urls = j2.data.	
							  			split(/(?=(ftp|http|htttp):\/\/)/).	
										filter(function(v){return v.length>6}).
										map( function(v,k,a){ var a=v.match(/(^[fht]+tps?:\/\/[ -^]+)/ig); if(a && a.length) return a.pop(); } ).
										filter(String);
								urls = is.Unique(urls);
								//=> modern browsers now have the powerful el.insertAdjacentHTML("afterBegin",....)
								//var html = '<a class="recent-window recent-menu-item" href="'+''+'">'+urls.length+' Tab(s)</a>';
								//access to local resources is not permitted: e.g. '<a class="recent-menu-item" href="'+v+'" style="background-image: url(chrome://favicon/'+v+'); ">'+
								var html = urls.map( function(v){ if(v) return innerHTML = '<a class="recent-menu-item" href="'+v+'" style="background-image: url(res/ico/link16.png);">'+
								//not even via an iframe....
								//'<iframe src="chrome://favicon/'+v+'" border="0" style="width:16px; height:16px;"></iframe>'+
																	v.match(/(^[fht]+tps?:\/\/[a-z0-9.\-_]+)/i)[1] +'</a>' }).join('');
								elmenu.innerHTML = html;
								
								//create open all tabs -> limited to popups unfortunately on some browsers; works fine with Chrome (i.e. user-initiated action)
								var ela = document.createElement('a');
								ela.href = '#';
								ela.className = "recent-window recent-menu-item";
								ela.innerHTML = urls.length+' Tab(s)';
								//open the tabs upon clicking, requires user action; non-interaction: popup		
								ela.onclick = function(){ urls.slice(0,maxopen).map(openTabsWin); };
								elmenu.insertBefore(ela, elmenu.getElementsByTagName('a')[0])
								
								console.log(urls)
						};

						el.ondrop = function(e)
						{
							eventstop(e);
							for (var i = 0; i < e.dataTransfer.files.length; i++) { 
								// e.dataTransfer is a DataTransfer object (https://developer.mozilla.org/En/DragDrop/DataTransfer),
								//e.dataTransfer.files is a FileList object (https://developer.mozilla.org/en/DOM/FileList)
								var file = e.dataTransfer.files[i]; // file is a File object (https://developer.mozilla.org/en/DOM/File)
								freader.readAsText(file);
								//console.log( "data FileReader:", freader); //undefined
							}
							if(j2.elIF.onchange)
								j2.elIF.onchange(e);
						};

						el.ondragenter = el.ondragstart = function(e) { console.log(e.target.className);
									eventstop(e); /*must be on top for Firefox*/
									//e.target.style.backgroundColor = "#ffc";
									//j2.cls.add('jtxtactive');
									e.target.className += RegExp('('+cssClassDrag+')','ig').test(e.target.className) ? '' : ' '+cssClassDrag;
						};
						//el.addEventListener('dragenter', function(e) {}, false);
						el.dragend = el.ondragleave = function(e) {
									eventstop(e);
									//e.target.style.backgroundColor = "#fff"; 
									//j2.cls.del('jtxtactive');
									e.target.className = e.target.className.replace(RegExp('[\\\s]*'+cssClassDrag+'[\\\s]*','ig'), ' ');
						};
						el.addEventListener('dragover', function(e) { 
									eventstop(e); 
						}, false);
					   console.log("DnD event listener added:" + this.div );
						//document.getElementById(mconf.elfiles).addEventListener('change', this.onFileSelect, false);
		
					}
				};
				//create a new uploader instance
				xhrUpld = xhrUploader( elTxtBxj );
			}//endwith
			
		};