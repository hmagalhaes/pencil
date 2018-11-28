var ui = {
	ANIM: 300, // animation time

	MODE_ALL: "dial notes",
	MODE_DEFAULT: "",
	MODE_DIAL: "dial",
	MODE_NOTES: "notes",

	htmlContainer: null,

	initializing: false,
	loaded: false,

	// should run in document.ready
	init: function() {
		this.initializing = true;

		this.htmlContainer = $("html");

		this.loading.init();
		this.pages.init();
		this.frame.init();
		this.notes.init();
		this.dial.init();
		this.panel.init();

		// escape button event
		document.addEventListener("keydown", function(e) { ui.keyDown(e.which || e.keyCode); });
		document.addEventListener("keyup", function(e) { ui.keyUp(e.which || e.keyCode); });

		ui.reset();
		ui.checkUrl();

		this.initializing = false;
		this.load();
	},

	// should run in window.load
	load: function() {
		if (!this.loaded && !this.initializing) {
			this.loading.hide();
			this.loaded = true;
		}
	},

	loading: {
		init: function() {
			this.container = $(document.body).children("#loading");
			this.container.children("p").html(lang.loading.msg);
		},
		hide: function() {
			this.container.remove();
		}
	},

	// the pages collection
	pages: {
		pages: [],
		pageMap: {},
		currentPage: null,
		lastShownPageId: null,

		init: function() {
			this.container = $(document.body).children("#dial>div>div");
		},
		addPage: function(pg) {
			var _img = pg.find(".img>img");
			var page = {
				id: pg.attr("_id"),
				index: this.pages.length,
				title: pg.children("h2"),
				notes: pg.children(".notes"),
				image: {
					el: pg.find(".img>img"),
					getURL: function() { return this.el.prop("src"); },
					getWidth: function() { return this.el.attr("_width"); },
					getHeight: function() { return this.el.attr("_height"); }
				},

				//
				getTitle: function() {
					var t = $.trim(this.title.html());
					return t != "" ? t : lang.page.dfTitle;
				},
				getNotes: function() {
					return $.trim(this.notes.html());
				}
			};

			ui.pages.pages.push(page);
			ui.pages.pageMap[page.id] = page;

			return page;
		},
		loadPage: function(id) {
			var p = this.pageMap[id];
			if (p) {
				this.currentPage = p;
				this.lastShownPageId = id;
				return true;
			}
			return false;
		}
	},

	// the pages frame
	frame: {
		init: function() {
			this.container = $(document.body).children("#frame");
			this.imageFrame = this.container.find(".img-frame");
			this.currentImg = null;
			this.hide();
		},
		loadPage: function() {
			var p = ui.pages.currentPage;
			this.imageFrame.empty()
					.prepend("<img src='" + p.image.getURL() +
							"' width='" + p.image.getWidth() +
							"' height='" + p.image.getHeight()
							+ "' usemap='#map_" + p.id + "'/>");
		},
		show: function() {
			this.container.show(ui.ANIM);
		},
		hide: function() {
			this.container.hide(ui.ANIM);
		},
		showHotspots: function() {
			this.hideHotspots();

			var img = this.imageFrame.find(">img");

			var $canvas = $("<canvas></canvas>")
					.attr("width", img.width())
					.attr("height", img.height())
					.appendTo(this.imageFrame);

			var ctx = $canvas.get(0).getContext("2d");
			ctx.fillStyle = "rgba(0, 255, 249, 0.4)";

			var page = ui.pages.currentPage;
			var mapSelector = "map[name=map_" + page.id + "]";
			$(mapSelector).find(">area").each(function(i, area) {
				var coords = $(area).attr("coords");
				if (coords == null || $.trim(coords) == "") {
					return;
				}
				var parts = coords.split(",");

				var left = parseInt(parts[0]);
				var top = parseInt(parts[1]);
				var width = parseInt(parts[2]) - left;
				var height = parseInt(parts[3]) - top;

				ctx.fillRect(left, top, width, height);
			});
		},
		hideHotspots: function() {
			this.imageFrame.find("canvas").remove();
		}
	},

	notes: {
		init: function() {
			this.container = $(document.body).children("#notes");
			var _inner = this.container.children("div");
			this.title = _inner.children("h1");
			this.text = _inner.children("div");
			this.hide();
		},
		load: function() {
			this.title.html( ui.pages.currentPage.getTitle() );
			this.text.html( ui.pages.currentPage.getNotes() );
		},
		show: function() {
			this.load();
			this.container.show(ui.ANIM);
		},
		hide: function() {
			this.container.hide(ui.ANIM);
		}
	},

	// the Dial module
	dial: {
		init: function() {
			this.container = $(document.body).children("#dial");
			var _inner = this.container.children("div");
			var _list = _inner.children("div");

			_list.children(".page").each(function(i) {
				var q = $(this);
				var p = ui.pages.addPage(q);

				q.data("id", p.id).
						prop("title", lang.dial.linkTitle).
						bind("click", function() {
							ui.goToPage($(this).data("id"));
							ui.reset();
						});
			});

			// lang
			_inner.children("h1").html(lang.dial.title);

			this.hide();
		},
		show: function() {
			this.container.show(ui.ANIM);
		},
		hide: function() {
			this.container.hide();
		}
	},

	panel: {
		init: function() {
			this.container = $(document.body).children("#panel");
			this.hide();

			var _inner = this.container.children("div");
			this.title = _inner.children("h1");

			var _x = this.container.find(".buttons");
			this.buttons = {
				notes: _x.children(".notes"),
				home: _x.children(".home"),
				dial: _x.children(".dial"),
				back: _x.children(".back")
			};

			// lang
			this.buttons.home.prop("title", lang.panel.buttons.home);
			this.buttons.dial.prop("title", lang.panel.buttons.dial);
			this.buttons.back.prop("title", lang.panel.buttons.back);
				// the notes button has special treatment

			// events
			this.buttons.notes.bind("click", function() {
				if (! $(this).hasClass("disabled")) {
					ui.frame.hide();
					ui.notes.show();
					ui.setMode(ui.MODE_NOTES);
				}
			});
			this.buttons.home.bind("click", function() {
				ui.goToFirstPage();
			});
			this.buttons.dial.bind("click", function() {
				ui.frame.hide();
				ui.dial.show();
				ui.setMode(ui.MODE_DIAL);
			});
			this.buttons.back.bind("click", function() {
				ui.reset();
			});
		},
		loadPage: function() {
			this.title.html( ui.pages.currentPage.getTitle() );
			if (ui.pages.currentPage.getNotes() == "") {
				this.buttons.notes.addClass("disabled");
				this.buttons.notes.prop("title", lang.panel.buttons.notesEmpty);
			} else {
				this.buttons.notes.removeClass("disabled");
				this.buttons.notes.prop("title", lang.panel.buttons.notes);
			}
		},
		setMode: function(m) {
			this.container.removeClass(ui.MODE_ALL);
			this.container.addClass(m);
		},

		show: function() {
			this.container.show();
		},
		hide: function() {
			//this.container.hide();
		},
	},

	setMode: function(m) {
		this.htmlContainer.removeClass(this.MODE_ALL);
		this.htmlContainer.addClass(m);
		this.panel.setMode(m);
	},

	reset: function() {
		this.dial.hide();
		this.notes.hide();
		this.frame.show();
		this.panel.show();
		this.setMode(this.MODE_DEFAULT);
	},

	keyDown: function(k) {
		if (k == 27) {
			this.reset();
		}
		if (k == 16) { // shift
			this.frame.showHotspots();
		}
	},

	keyUp: function(k) {
		if (k == 16) { // shift
			this.frame.hideHotspots();
		}
	},

	loadPage: function(id) {
		if (this.pages.loadPage(id)) {
			this.panel.loadPage();
			this.frame.loadPage();
		}
	},

	goToPage: function(id) {
		window.location.href = "#" + id;
	},

	goToFirstPage: function() {
		var f = this.pages.pages[0];
		this.goToPage(f.id);
		this.loadPage(f.id);
	},

	/**
	 * It keeps checking the current URL and updating the visible screen if it's needed.
	 */
	checkUrl: function() {
		try {
			if (window.location.href.match(/#(.*)$/)) {
				var id = RegExp.$1;
				if (this.pages.lastShownPageId != id) {
					this.loadPage(id);
				}
			} else if (this.pages.pages.length > 0) {
				this.goToFirstPage();
			}
		} catch (ex) {
			throw ex;
		} finally {
			window.setTimeout(function(){ ui.checkUrl(); }, 200);
		}
	}
};


// Setup
$(function() {
	ui.init();
});

$(window).load(function() {
	ui.load();
});
