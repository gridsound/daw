(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['clock'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"clock\">\r\n	<span id=\"clockMin\"></span>\r\n	<span id=\"clockSec\"></span>\r\n	<span id=\"clockMs\"></span>\r\n	<a id=\"clockUnits\" href=\"#\">\r\n		<span class=\"s\">sec</span>\r\n		<span class=\"b\">beat</span>\r\n	</a>\r\n</div>\r\n";
},"useData":true});
templates['file'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<a class=\"sample\" draggable=\"true\">\r\n	<div class=\"waveformWrapper\">\r\n		<svg class=\"waveform\" preserveAspectRatio=\"none\"><path/></svg>\r\n	</div>\r\n	<span class=\"name text-overflow\">\r\n		<i class=\"icon fw\"></i>\r\n		<span>"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n	</span>\r\n</a>\r\n";
},"useData":true});
templates['grid'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"grid\">\r\n	<div id=\"gridEm\">\r\n		<div id=\"gridHeader\">\r\n"
    + ((stack1 = container.invokePartial(partials.timeline,depth0,{"name":"timeline","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "		</div>\r\n		<div id=\"tracks\">\r\n			<div id=\"gridCols\">\r\n				<div id=\"tracksNames\" class=\"colA\">\r\n					<div class=\"extend\" data-mousemove-fn=\"trackNames\"></div>\r\n				</div>\r\n				<div id=\"gridColB\">\r\n					<div id=\"tracksBg\"></div>\r\n					<div id=\"tracksLines\">\r\n						<div id=\"currentTimeCursor\"></div>\r\n					</div>\r\n				</div>\r\n			</div>\r\n		</div>\r\n	</div>\r\n</div>\r\n";
},"usePartial":true,"useData":true});
templates['historyAction'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a class=\"task\">\r\n	<i class=\"icon fw circle\"></i\r\n	><i class=\"icon fw tool tool-"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"></i\r\n	><b class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</b\r\n	><span class=\"text\">"
    + ((stack1 = ((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"desc","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\r\n</a>\r\n";
},"useData":true});
templates['menu'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"menu\">\r\n	<a id=\"btnPlay\" class=\"btn border icon play\" title=\"Play/pause (press Space, hold Ctrl for pause)\"></a>\r\n	<a id=\"btnStop\" class=\"btn border icon stop\" title=\"Stop (press Space)\"></a>\r\n	<div id=\"bpm\" class=\"border\" title=\"Beats per minute (Scroll to change)\">\r\n		<span class=\"text\">\r\n			<a class=\"bpmLink\">\r\n				<i class=\"icon\"></i>\r\n				<span id=\"bpmInt\"></span>\r\n				<span id=\"bpmDec\"></span>\r\n			</a>\r\n			<div id=\"bpmList\">\r\n				<a>80</a><a>90</a><a>100</a>\r\n				<a>110</a><a>120</a><a>130</a>\r\n				<a>140</a><a>150</a><a>160</a>\r\n			</div>\r\n			<span class=\"unit\">bpm</span>\r\n		</span>\r\n	</div>\r\n	<a data-edit=\"save\"     id=\"btnSave\"   class=\"btn icon fw save\" title=\"Save\"></a>\r\n	<a data-option=\"magnet\" id=\"btnMagnet\" class=\"btn icon fw magnet\" title=\"Toggle magnetism (press G)\"></a>\r\n	<div class=\"sep\"></div>\r\n	<a data-tool=\"select\" class=\"btn icon fw tool-select\" title=\"Select (hold Shift or press V)\"></a>\r\n	<a data-tool=\"paint\"  class=\"btn icon fw tool-paint\" title=\"Paint (press B)\"></a>\r\n	<a data-tool=\"delete\" class=\"btn icon fw tool-delete\" title=\"Delete (press D)\"></a>\r\n	<a data-tool=\"mute\"   class=\"btn icon fw tool-mute\" title=\"Mute (press M)\" style=\"display: none;\"></a>\r\n	<a data-tool=\"slip\"   class=\"btn icon fw tool-slip\" title=\"Slip (press S)\"></a>\r\n	<a data-tool=\"cut\"    class=\"btn icon fw tool-cut\" title=\"Cut (press C)\"></a>\r\n	<a data-tool=\"hand\"   class=\"btn icon fw tool-hand\" title=\"Hand (hold Alt or press H)\"></a>\r\n	<a data-tool=\"zoom\"   class=\"btn icon fw tool-zoom last\" title=\"Zoom (hold Ctrl or press Z)\"></a>\r\n	<div class=\"flex1\"></div>\r\n	<a href=\"..\" target=\"_blank\" class=\"icon about\" title=\"About\"></a>\r\n</div>\r\n";
},"useData":true});
templates['panel-files'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"files\">\r\n	<input id=\"filesInput\" type=\"file\"/>\r\n	<nav id=\"filesFilters\">\r\n		<a href=\"#\" class=\"used\">Used</a>\r\n		<a href=\"#\" class=\"loaded\">Loaded</a>\r\n		<a href=\"#\" class=\"unloaded\">Unloaded</a>\r\n	</nav>\r\n	<div id=\"filesList\" class=\"list\"></div>\r\n	<div class=\"placeholder\">\r\n		<i class=\"icon file-audio\"></i><br/>\r\n		<b>Drop audio files here</b>\r\n	</div>\r\n</section>\r\n";
},"useData":true});
templates['panel-history'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"history\">\r\n	<nav>\r\n		<span class=\"title\">History</span>\r\n		<a href=\"#\" id=\"btnUndo\" class=\"btn icon fw undo\" title=\"Undo (Ctrl + Z)\"></a>\r\n		<a href=\"#\" id=\"btnRedo\" class=\"btn icon fw redo\" title=\"Redo (Ctrl + Shift + Z)\"></a>\r\n	</nav>\r\n	<div id=\"historyList\" class=\"list\"></div>\r\n</section>\r\n";
},"useData":true});
templates['panel'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"panel\">\r\n	<div class=\"extend\" data-mousemove-fn=\"panel\"></div>\r\n"
    + ((stack1 = container.invokePartial(partials["panel-history"],depth0,{"name":"panel-history","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["panel-files"],depth0,{"name":"panel-files","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\r\n";
},"usePartial":true,"useData":true});
templates['sample'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"sample\">\r\n	<div class=\"waveformWrapper\">\r\n		<svg class=\"waveform\" preserveAspectRatio=\"none\"><path/></svg>\r\n	</div>\r\n	<span class=\"name text-overflow\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n	<div class=\"crop start\"></div>\r\n	<div class=\"crop end\"></div>\r\n</div>\r\n";
},"useData":true});
templates['timeline'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"timeline\">\r\n	<span id=\"currentTimeArrow\" class=\"icon caret-down\"></span>\r\n"
    + ((stack1 = container.invokePartial(partials.timelineLoop,depth0,{"name":"timelineLoop","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\r\n";
},"usePartial":true,"useData":true});
templates['timelineBeat'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<span class=\"timelineBeat\">\r\n	<span></span>\r\n</span>\r\n";
},"useData":true});
templates['timelineLoop'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"timelineLoop\"></div>\r\n";
},"useData":true});
templates['visual'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"visual\">\r\n	<canvas id=\"visualCanvas\"></canvas>\r\n	<div class=\"columns\">\r\n		<div class=\"cell-btn\"><a id=\"btnHistory\" class=\"btn icon fw history\" title=\"History (undo/redo)\"></a></div>\r\n		<div class=\"cell-btn\"><a id=\"btnFiles\" class=\"btn icon fw files\" title=\"Audio files\"></a></div>\r\n		<div class=\"cell-clock\">\r\n"
    + ((stack1 = container.invokePartial(partials.clock,depth0,{"name":"clock","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "		</div>\r\n	</div>\r\n</div>\r\n";
},"usePartial":true,"useData":true});
templates['_app'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.visual,depth0,{"name":"visual","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.menu,depth0,{"name":"menu","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.panel,depth0,{"name":"panel","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.grid,depth0,{"name":"grid","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
})();