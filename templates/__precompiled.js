(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['_app'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.visual,depth0,{"name":"visual","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.menu,depth0,{"name":"menu","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.panel,depth0,{"name":"panel","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.grid,depth0,{"name":"grid","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"usePartial":true,"useData":true});
templates['clock'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"clock\">\n	<span id=\"clockMin\"></span>\n	<span id=\"clockSec\"></span>\n	<span id=\"clockMs\"></span>\n	<a id=\"clockUnits\" href=\"#\">\n		<span class=\"s\">sec</span>\n		<span class=\"b\">beat</span>\n	</a>\n</div>\n";
},"useData":true});
templates['file'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<a class=\"sample\" draggable=\"true\">\n	<div class=\"waveformWrapper\">\n		<svg class=\"waveform\" preserveAspectRatio=\"none\"><path/></svg>\n	</div>\n	<span class=\"name text-overflow\">\n		<i class=\"icon fw\"></i>\n		<span>"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n	</span>\n</a>\n";
},"useData":true});
templates['grid'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"grid\">\n	<div id=\"gridEm\">\n		<div id=\"gridHeader\">\n"
    + ((stack1 = container.invokePartial(partials.timeline,depth0,{"name":"timeline","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "		</div>\n		<div id=\"tracks\">\n			<div id=\"gridCols\">\n				<div id=\"tracksNames\" class=\"colA\">\n					<div class=\"extend\" data-mousemove-fn=\"trackNames\"></div>\n				</div>\n				<div id=\"gridColB\">\n					<div id=\"tracksBg\"></div>\n					<div id=\"tracksLines\">\n						<div id=\"currentTimeCursor\"></div>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n";
},"usePartial":true,"useData":true});
templates['historyAction'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<a class=\"task\">\n	<i class=\"icon fw circle\"></i\n	><i class=\"icon fw tool tool-"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\"></i\n	><b class=\"title\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</b\n	><span class=\"text\">"
    + ((stack1 = ((helper = (helper = helpers.desc || (depth0 != null ? depth0.desc : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"desc","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</span>\n</a>\n";
},"useData":true});
templates['menu'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"menu\">\n	<a id=\"btnPlay\" class=\"btn border icon play\" title=\"Play/pause (press Space, hold Ctrl for pause)\"></a>\n	<a id=\"btnStop\" class=\"btn border icon stop\" title=\"Stop (press Space)\"></a>\n	<div id=\"bpm\" class=\"border\" title=\"Beats per minute (Scroll to change)\">\n		<span class=\"text\">\n			<a class=\"bpmLink\">\n				<i class=\"icon\"></i>\n				<span id=\"bpmInt\"></span>\n				<span id=\"bpmDec\"></span>\n			</a>\n			<div id=\"bpmList\">\n				<a>80</a><a>90</a><a>100</a>\n				<a>110</a><a>120</a><a>130</a>\n				<a>140</a><a>150</a><a>160</a>\n			</div>\n			<span class=\"unit\">bpm</span>\n		</span>\n	</div>\n	<a data-edit=\"save\"     id=\"btnSave\"   class=\"btn icon fw save\" title=\"Save\"></a>\n	<a data-option=\"magnet\" id=\"btnMagnet\" class=\"btn icon fw magnet\" title=\"Toggle magnetism (press G)\"></a>\n	<div class=\"sep\"></div>\n	<a data-tool=\"select\" class=\"btn icon fw tool-select\" title=\"Select (hold Shift or press V)\"></a>\n	<a data-tool=\"paint\"  class=\"btn icon fw tool-paint\" title=\"Paint (press B)\"></a>\n	<a data-tool=\"delete\" class=\"btn icon fw tool-delete\" title=\"Delete (press D)\"></a>\n	<a data-tool=\"gain\"   class=\"btn icon fw tool-gain\" title=\"Gain (press G)\"></a>\n	<a data-tool=\"slip\"   class=\"btn icon fw tool-slip\" title=\"Slip (press S)\"></a>\n	<a data-tool=\"cut\"    class=\"btn icon fw tool-cut\" title=\"Cut (press C)\"></a>\n	<a data-tool=\"hand\"   class=\"btn icon fw tool-hand\" title=\"Hand (hold Alt or press H)\"></a>\n	<a data-tool=\"zoom\"   class=\"btn icon fw tool-zoom last\" title=\"Zoom (hold Ctrl or press Z)\"></a>\n	<div class=\"flex1\"></div>\n	<a href=\"..\" target=\"_blank\" class=\"icon about\" title=\"About\"></a>\n</div>\n";
},"useData":true});
templates['panel-files'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"files\">\n	<input id=\"filesInput\" type=\"file\"/>\n	<nav id=\"filesFilters\">\n		<a href=\"#\" class=\"used\">Used</a>\n		<a href=\"#\" class=\"loaded\">Loaded</a>\n		<a href=\"#\" class=\"unloaded\">Unloaded</a>\n	</nav>\n	<div id=\"filesList\" class=\"list\"></div>\n	<div class=\"placeholder\">\n		<i class=\"icon file-audio\"></i><br/>\n		<b>Drop audio files here</b>\n	</div>\n</section>\n";
},"useData":true});
templates['panel-history'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<section id=\"history\">\n	<nav>\n		<span class=\"title\">History</span>\n		<a id=\"btnUndo\" class=\"btn icon fw undo\" title=\"Undo (Ctrl + Z)\"></a>\n		<a id=\"btnRedo\" class=\"btn icon fw redo\" title=\"Redo (Ctrl + Shift + Z)\"></a>\n	</nav>\n	<div id=\"historyList\" class=\"list\"></div>\n</section>\n";
},"useData":true});
templates['panel'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"panel\">\n	<div class=\"extend\" data-mousemove-fn=\"panel\"></div>\n"
    + ((stack1 = container.invokePartial(partials["panel-history"],depth0,{"name":"panel-history","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["panel-files"],depth0,{"name":"panel-files","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>\n";
},"usePartial":true,"useData":true});
templates['sample'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"sample\">\n	<div class=\"waveformWrapper\">\n		<svg class=\"waveform\" preserveAspectRatio=\"none\"><path/></svg>\n	</div>\n	<span class=\"name text-overflow\">"
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n	<div class=\"crop start\"></div>\n	<div class=\"crop end\"></div>\n</div>\n";
},"useData":true});
templates['timeline'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"timeline\">\n	<span id=\"currentTimeArrow\" class=\"icon caret-down\"></span>\n"
    + ((stack1 = container.invokePartial(partials.timelineLoop,depth0,{"name":"timelineLoop","data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "	<div id=\"timelineBeats\"></div>\n</div>\n";
},"usePartial":true,"useData":true});
templates['timelineBeat'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<span class=\"timelineBeat\">\n	<span></span>\n</span>\n";
},"useData":true});
templates['timelineLoop'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"timelineLoop\">\n	<div class=\"time a\"></div>\n	<div class=\"time b\"></div>\n</div>\n";
},"useData":true});
templates['visual'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"visual\">\n	<canvas id=\"visualCanvas\"></canvas>\n	<div class=\"columns\">\n		<div class=\"cell-btn\"><a id=\"btnHistory\" class=\"btn icon fw history\" title=\"History (undo/redo)\"></a></div>\n		<div class=\"cell-btn\"><a id=\"btnFiles\" class=\"btn icon fw files\" title=\"Audio files\"></a></div>\n		<div class=\"cell-clock\">\n"
    + ((stack1 = container.invokePartial(partials.clock,depth0,{"name":"clock","data":data,"indent":"\t\t\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "		</div>\n	</div>\n</div>\n";
},"usePartial":true,"useData":true});
})();