(function($, document) {
	//创建 DOM
	$.dom = function(str) {
		if (typeof(str) !== 'string') {
			if ((str instanceof Array) || (str[0] && str.length)) {
				return [].slice.call(str);
			} else {
				return [str];
			}
		}
		if (!$.__create_dom_single_div__) {
			$.__create_dom_single_div__ = document.createElement('div');
		}
		$.__create_dom_single_div__.innerHTML = str;
		return [].slice.call($.__create_dom_single_div__.childNodes);
	};

	var panelBuffer = '<div class="mui-listpicker" style="height:100%;width:300px">\
		<div class="mui-listpicker-header">\
			<table width=100%><tr>\
				<td width=40><span class="mui-listpicker-btn-cancel"></span></td>\
				<td align=right><span class="mui-listpicker-clear">清空</span></td>\
			</tr></table>\
			<div style="height:6px"></div>\
			<div class="mui-input-row" style="height:40px;">\
				<input type="text" class="mui-listpicker-filter mui-input-clear" placeholder="过滤选项" style="border-radius: 15px;padding:10px 25px;">\
			</div>\
		</div>\
		<div class="mui-listpicker-body">\
		</div>\
	</div>';

	var pickerBuffer = '<div style="height:100%;overflow:auto;">\
		<table id=singleTbl width=100% style="font-size:15px;">\
		</table>\
	</div>';

	//定义弹出选择器类
	var SinglePicker = $.SinglePicker = $.Class.extend({
		//构造函数
		init: function(options) {
			var self = this;
			self.options = options || {};
			self.options.buttons = self.options.buttons || ['取消', '确定'];
			self.panel = $.dom(panelBuffer)[0];
			document.body.appendChild(self.panel);
			self.cancel = self.panel.querySelector('.mui-listpicker-btn-cancel');
			self.clear = self.panel.querySelector('.mui-listpicker-clear');
			self.filter = self.panel.querySelector('.mui-listpicker-filter');
			mui(self.filter).input();    //控件初始化
			self.header = self.panel.querySelector('.mui-listpicker-header');
			self.body = self.panel.querySelector('.mui-listpicker-body');
			self.mask = $.createMask();
			self.cancel.addEventListener('tap', function(event) {
				self.hide();
			}, false);
			self.clear.addEventListener('tap', function(event) {
				if (self.callback) {
					var rs = self.callback( "", "" );
					if (rs !== false) {
						self.hide();
					}
				}
			}, false);
			self.filter.addEventListener('tap', function(event) {
				this.focus();
			}, false);
			self.filter.addEventListener('input', function(event) {
				self.filtItem( this.value );
			}, false);
			var caca = self.panel.querySelector('.mui-icon-clear');   //过滤框右边的叉叉
			caca.addEventListener('tap', function(event) {
				self.filtItem( "" );
			}, false);
			self.mask[0].addEventListener('tap', function() {
				self.hide();
			}, false);
			self._createPicker();
			//防止滚动穿透
			self.panel.addEventListener('touchstart', function(event) {
				event.preventDefault();
			}, false);
			self.panel.addEventListener('touchmove', function(event) {
				event.preventDefault();
			}, false);
		},
		_createPicker: function() {
			var self = this;
			var height = '100%';
			var pickerElement = $.dom(pickerBuffer)[0];
			pickerElement.style.height = height;
			self.body.appendChild(pickerElement);
			self.table = $("#singleTbl")[0];
			pickerElement.addEventListener('touchstart', function(event) {
				event.preventDefault();
				self.startY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
				self.startTop = pickerElement.scrollTop;
			}, false);
			pickerElement.addEventListener('touchmove', function(event) {
				event.preventDefault();
				var endY = (event.changedTouches ? event.changedTouches[0] : event).pageY;
				var dy = endY - self.startY;
				pickerElement.scrollTop = self.startTop - dy;
			}, false);
		},
		//填充数据
		setData: function(data) {
			var self = this;
			data = data || [];
			var tbl = self.table;
			for( var i = tbl.rows.length - 1; i >= 0; i-- ) {
				tbl.deleteRow( i );
			}
			for( var i = 0; i < data.length; i++ ) {
				var row = tbl.insertRow( -1 );
				row.style.height = "35px";
				row.style.borderBottom = "1px solid #dfdfe4";
				row.setAttribute( "value", data[i].value );
				var cell = row.insertCell( -1 );
				cell.style.textAlign = "left";
				cell.style.paddingLeft = "10px";
				cell.innerText = data[i].text;
				cell.addEventListener('tap', function(event) {
					if (self.callback) {
						var prow = this.parentNode || this.parentElement;
						var rs = self.callback( prow.getAttribute("value"), this.innerText );
						if (rs !== false) {
							self.hide();
						}
					}
				}, false);
			}
		},
		setSelectedItem: function(value) {
			var self = this;
			var tbl = self.table;
			for( var i = 0; i < tbl.rows.length; i++ ) {
				var row = tbl.rows[i];
				var v = row.getAttribute( "value" );
				if( v == value ) {
					row.cells[0].classList.add( $.className('single-selected') );
				}
				else {
					row.cells[0].classList.remove( $.className('single-selected') );
				}
			}
		},
		filtItem: function( inputValue ) {
			var self = this;
			var tbl = self.table;
			for( var i = 0; i < tbl.rows.length; i++ ) {
				var row = tbl.rows[i];
				var cell = row.cells[0];
				if( cell.innerText.indexOf( inputValue ) >= 0 ) {
					row.style.display = "";
				}
				else row.style.display = "none";
			}
		},
		//显示
		show: function(callback) {
			var self = this;
			self.callback = callback;
			self.mask.show();
			document.body.classList.add($.className('poppicker-active-for-page'));
			self.panel.classList.add($.className('active'));
			window.history.pushState( {status:""}, "title", "#" + (new Date()).getTime() ); 
			self.body.style.height = ( self.panel.offsetHeight - self.header.offsetHeight ) + "px";
			//处理物理返回键
			self.__back = $.back;
			$.back = function() {
				self.hide();
			};
		},
		//隐藏
		hide: function() {
			var self = this;
			if (self.disposed) return;
			self.panel.classList.remove($.className('active'));
			self.mask.close();
			document.body.classList.remove($.className('poppicker-active-for-page'));
			self.filter.value = "";
			//处理物理返回键
			$.back=self.__back;
		},
		hideClear: function() {
			var self = this;
			self.clear.style.display = "none";
		},
		showClear: function() {
			var self = this;
			self.clear.style.display = "";
		},
		dispose: function() {
			var self = this;
			self.hide();
			setTimeout(function() {
				self.panel.parentNode.removeChild(self.panel);
				for (var name in self) {
					self[name] = null;
					delete self[name];
				};
				self.disposed = true;
			}, 300);
		}
	});

})(mui, document);